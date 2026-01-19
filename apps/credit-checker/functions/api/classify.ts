// Cloudflare Workers AI - カテゴリ分類API
// ベストエフォート方式：無料枠超過・エラー時は空の結果を返す（分類不能扱い）

interface Env {
  AI: Ai;
}

interface ClassifyRequest {
  descriptions: string[];
}

interface ClassifyResult {
  index: number;
  category: string;
  confidence: number;
}

const CATEGORIES = [
  '食費',
  'コンビニ',
  'カフェ',
  '日用品',
  '交通費',
  '通信費',
  'サブスク',
  'ショッピング',
  '娯楽',
  '医療・健康',
  '保険',
  '公共料金',
  'その他'
];

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { descriptions } = await context.request.json() as ClassifyRequest;

    if (!descriptions || !Array.isArray(descriptions) || descriptions.length === 0) {
      // 無効なリクエストでも空の結果を返す（ベストエフォート）
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 最大50件に制限（要件定義書通り）
    const limitedDescriptions = descriptions.slice(0, 50);

    const prompt = `
あなたはクレジットカード明細のカテゴリ分類アシスタントです。
以下の店名/利用先をカテゴリに分類してください。

カテゴリ一覧: ${CATEGORIES.join(', ')}

店名リスト:
${limitedDescriptions.map((d: string, i: number) => `${i + 1}. ${d}`).join('\n')}

回答はJSON配列形式で、各項目に対して以下の形式で返してください:
[{"index": 1, "category": "カテゴリ名", "confidence": 80}, ...]

confidenceは0-100の数値で、分類の確信度を表します。
判断できない場合は"その他"としてください。

JSON配列のみを返してください。説明は不要です。
`;

    const response = await context.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt,
      max_tokens: 1000,
    });

    // レスポンスからJSON部分を抽出
    let results: ClassifyResult[] = [];

    try {
      const responseText = typeof response === 'string'
        ? response
        : (response as any).response || JSON.stringify(response);

      // JSON配列を抽出
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        results = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // パース失敗時は空の結果（ベストエフォート）
      results = [];
    }

    // バリデーション
    const validResults = results.filter(
      (r): r is ClassifyResult =>
        typeof r.index === 'number' &&
        typeof r.category === 'string' &&
        CATEGORIES.includes(r.category)
    );

    return new Response(JSON.stringify(validResults), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    // エラー時も空の結果を返す（ベストエフォート）
    // 無料枠超過、ネットワークエラー等は全て「確認できませんでした」扱い
    return new Response(JSON.stringify([]), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};

// OPTIONSリクエスト対応（CORS）
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
