// PDF テキストから取引を抽出するAPI（Cloudflare Workers AI使用）

interface Env {
  AI: any;
}

interface ExtractRequest {
  text: string;
}

interface Transaction {
  date: string;
  description: string;
  amount: number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { text } = await context.request.json() as ExtractRequest;

    if (!text || text.length < 20) {
      return Response.json({ transactions: [] });
    }

    const prompt = `以下はクレジットカード明細のテキストです。取引データを抽出してJSON形式で返してください。

【抽出ルール】
- 日付はYYYY/MM/DD形式
- 金額は数値のみ（円やカンマなし）
- 説明は店舗名や商品名

【出力形式】
{"transactions":[{"date":"2024/01/15","description":"セブンイレブン","amount":580}]}

【テキスト】
${text.substring(0, 3000)}

【JSON出力】`;

    const response = await context.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      prompt,
      max_tokens: 2000,
    });

    // レスポンスからJSONを抽出
    const responseText = response.response || '';
    const jsonMatch = responseText.match(/\{[\s\S]*"transactions"[\s\S]*\}/);

    if (!jsonMatch) {
      return Response.json({ transactions: [] });
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const transactions: Transaction[] = (parsed.transactions || [])
        .filter((tx: any) => tx.date && tx.description && tx.amount)
        .map((tx: any) => ({
          date: String(tx.date),
          description: String(tx.description).trim(),
          amount: Math.abs(parseInt(String(tx.amount).replace(/[^\d]/g, ''), 10) || 0),
        }))
        .filter((tx: Transaction) => tx.amount > 0);

      return Response.json({ transactions });
    } catch {
      return Response.json({ transactions: [] });
    }
  } catch (error) {
    console.error('PDF extraction error:', error);
    return Response.json({ transactions: [] });
  }
};
