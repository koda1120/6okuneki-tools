// PDF解析処理
import * as pdfjsLib from 'pdfjs-dist';
import type { RawTransaction } from '../types';

// PDF.jsのワーカーを設定（v5用）
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PdfParseResult {
  success: boolean;
  transactions: RawTransaction[];
  rawText: string;
  error?: string;
  warning?: string;
}

// 日付パターン（様々な形式に対応）
const DATE_PATTERNS = [
  /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})日?/g,  // 2024/01/15, 2024-01-15, 2024年1月15日
  /(\d{1,2})[\/\-月](\d{1,2})日?/g,                  // 01/15, 1月15日
];

// 金額パターン
const AMOUNT_PATTERNS = [
  /[¥￥]?\s*([\d,]+)\s*円?/g,
  /(\d{1,3}(?:,\d{3})+|\d+)(?:\s*円)?/g,
];

// PDFからテキストを抽出
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

// テキストから取引を抽出（パターンマッチング）
function extractTransactionsFromText(text: string): RawTransaction[] {
  const transactions: RawTransaction[] = [];
  const lines = text.split('\n');

  // 各行を解析
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.length < 10) continue;

    // 日付を探す
    let dateMatch: RegExpMatchArray | null = null;
    let dateStr = '';

    for (const pattern of DATE_PATTERNS) {
      pattern.lastIndex = 0;
      const match = pattern.exec(trimmedLine);
      if (match) {
        dateMatch = match;
        if (match[1] && match[1].length === 4) {
          // YYYY/MM/DD形式
          const year = match[1];
          const month = match[2].padStart(2, '0');
          const day = match[3].padStart(2, '0');
          dateStr = `${year}/${month}/${day}`;
        } else if (match[1] && match[2]) {
          // MM/DD形式（今年を補完）
          const year = new Date().getFullYear();
          const month = match[1].padStart(2, '0');
          const day = match[2].padStart(2, '0');
          dateStr = `${year}/${month}/${day}`;
        }
        break;
      }
    }

    if (!dateStr) continue;

    // 金額を探す（行末付近の数値を優先）
    let amount = 0;
    const amountMatches: { value: number; index: number }[] = [];

    for (const pattern of AMOUNT_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmedLine)) !== null) {
        const value = parseInt(match[1].replace(/,/g, ''), 10);
        if (value > 0 && value < 10000000) { // 1000万円未満
          amountMatches.push({ value, index: match.index });
        }
      }
    }

    if (amountMatches.length === 0) continue;

    // 最も行末に近い金額を採用
    amountMatches.sort((a, b) => b.index - a.index);
    amount = amountMatches[0].value;

    // 説明文（日付と金額の間のテキスト）
    const dateIndex = trimmedLine.indexOf(dateMatch![0]);
    const amountIndex = amountMatches[0].index;

    let description = '';
    if (dateIndex < amountIndex) {
      description = trimmedLine
        .substring(dateIndex + dateMatch![0].length, amountIndex)
        .replace(/[¥￥\d,円]/g, '')
        .trim();
    }

    // 説明文が短すぎる場合はスキップ
    if (description.length < 2) continue;

    // 明らかにヘッダー行などをスキップ
    const skipKeywords = ['ご利用日', '利用日', '日付', '支払い', '請求', '合計', 'お支払い', '残高'];
    if (skipKeywords.some(kw => description.includes(kw))) continue;

    transactions.push({
      date: dateStr,
      description,
      amount,
    });
  }

  return transactions;
}

// AIを使用して取引を抽出（フォールバック）
async function extractTransactionsWithAI(text: string): Promise<RawTransaction[]> {
  try {
    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.substring(0, 8000) }), // トークン制限
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.transactions || [];
  } catch {
    return [];
  }
}

// メインのPDFパース関数
export async function parsePdf(file: File): Promise<PdfParseResult> {
  try {
    // テキスト抽出
    const rawText = await extractTextFromPdf(file);

    if (!rawText || rawText.trim().length < 50) {
      return {
        success: false,
        transactions: [],
        rawText: '',
        error: 'PDFからテキストを抽出できませんでした。画像ベースのPDFには対応していません。',
      };
    }

    // パターンマッチングで抽出
    let transactions = extractTransactionsFromText(rawText);

    // 取引が少なすぎる場合はAIにフォールバック
    if (transactions.length < 3) {
      const aiTransactions = await extractTransactionsWithAI(rawText);
      if (aiTransactions.length > transactions.length) {
        transactions = aiTransactions;
      }
    }

    if (transactions.length === 0) {
      return {
        success: false,
        transactions: [],
        rawText,
        error: 'PDFから取引データを抽出できませんでした。CSVでのアップロードをお試しください。',
      };
    }

    return {
      success: true,
      transactions,
      rawText,
      warning: 'PDFからの抽出は精度にばらつきがあります。結果をご確認ください。',
    };
  } catch (error) {
    console.error('PDF parse error:', error);
    return {
      success: false,
      transactions: [],
      rawText: '',
      error: 'PDFの解析中にエラーが発生しました。',
    };
  }
}

// ファイルタイプを判定
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}
