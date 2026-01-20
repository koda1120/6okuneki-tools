// CSV解析処理
import Papa from 'papaparse';
import type { RawTransaction } from '../types';
import type { CsvFormat } from '../types/merchant';
import csvFormatsData from '../data/csvFormats.json';

const csvFormats = csvFormatsData as { formats: CsvFormat[] };

export interface ParseResult {
  success: boolean;
  transactions: RawTransaction[];
  format: string;
  error?: string;
}

// 金額をパース
function parseAmount(value: string): number {
  if (!value) return 0;
  // カンマ、円、¥を除去して数値に変換
  const cleaned = value.replace(/[,，円¥\s]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 0 : Math.abs(num);
}

// 日付を正規化（YYYY/MM/DD形式に統一）
function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';

  // 様々な日付形式に対応
  const patterns = [
    /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})/,  // 2024/01/15, 2024-01-15, 2024年1月15日
    /(\d{1,2})[\/\-月](\d{1,2})[\/\-日]?[\/\-]?(\d{4})?/, // 01/15/2024
  ];

  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      let year = match[1];
      let month = match[2];
      let day = match[3];

      // 年が4桁でない場合は現在の年を使用
      if (year && year.length !== 4) {
        const temp = year;
        year = day && day.length === 4 ? day : new Date().getFullYear().toString();
        day = temp;
      }

      if (year && month && day) {
        return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
      }
    }
  }

  return dateStr;
}

// CSVフォーマットを自動検出
function detectFormat(fields: string[]): CsvFormat | null {
  const normalizedFields = fields.map(f => f.trim());

  for (const format of csvFormats.formats) {
    const { date, description, amount } = format.columns;
    if (
      normalizedFields.includes(date) &&
      normalizedFields.includes(description) &&
      normalizedFields.includes(amount)
    ) {
      return format;
    }
  }

  return null;
}

// 汎用的なカラム検出（3段階のフォールバック）
function detectGenericColumns(
  fields: string[],
  sampleData?: Record<string, string>[]
): { date: string; description: string; amount: string } | null {
  const normalizedFields = fields.map(f => f.trim());

  // === Level 1: 厳密パターンマッチング ===
  // 日付カラムの候補（優先度順）
  const datePatterns = [
    '利用日', 'ご利用日', '日付', '日時', '取引日', '決済日', 'お支払日', '購入日',
    'Date', 'DATE', 'date', 'Transaction Date', 'Purchase Date'
  ];
  // 説明カラムの候補（優先度順）
  const descPatterns = [
    '利用店名', '利用店舗', 'ご利用先', '利用先', '店名', '店舗名', '店舗',
    '加盟店名', '加盟店', 'ご利用店', 'ご利用店名', '利用店名・商品名',
    '摘要', '内容', '利用内容', '明細', '商品名', '説明', 'お支払先',
    'Description', 'DESCRIPTION', 'Merchant', 'MERCHANT', 'Store', 'STORE'
  ];
  // 金額カラムの候補（優先度順）
  const amountPatterns = [
    '利用金額', 'ご利用金額', '金額', '支払金額', 'お支払金額', '利用額', '請求金額',
    'Amount', 'AMOUNT', 'amount', 'Price', 'PRICE'
  ];

  let dateCol: string | null = null;
  let descCol: string | null = null;
  let amountCol: string | null = null;

  // Level 1: 厳密マッチング（パターンがフィールドに含まれる）
  for (const field of normalizedFields) {
    if (!dateCol && datePatterns.some(p => field.includes(p))) {
      dateCol = field;
    }
    if (!descCol && descPatterns.some(p => field.includes(p))) {
      descCol = field;
    }
    if (!amountCol && amountPatterns.some(p => field.includes(p))) {
      amountCol = field;
    }
  }

  // Level 1で全て見つかったら返す
  if (dateCol && descCol && amountCol) {
    return { date: dateCol, description: descCol, amount: amountCol };
  }

  // === Level 2: 緩いキーワードマッチング ===
  // 日付を示すキーワード
  const looseDateKeywords = ['日', 'date', 'Date', 'DATE'];
  // 説明を示すキーワード（"日"や"金"を含まないもの）
  const looseDescKeywords = ['店', '先', '内容', '明細', '摘要', '商品', 'merchant', 'store', 'description'];
  // 金額を示すキーワード
  const looseAmountKeywords = ['金額', '額', '円', 'amount', 'price', 'Amount', 'Price'];

  for (const field of normalizedFields) {
    const lowerField = field.toLowerCase();

    // 日付カラム（未検出の場合のみ）
    if (!dateCol && looseDateKeywords.some(k => field.includes(k) || lowerField.includes(k.toLowerCase()))) {
      // "金額"に含まれる"日"を除外
      if (!looseAmountKeywords.some(k => field.includes(k))) {
        dateCol = field;
      }
    }

    // 説明カラム（未検出の場合のみ）
    if (!descCol && looseDescKeywords.some(k => field.includes(k) || lowerField.includes(k.toLowerCase()))) {
      // 日付や金額カラムと重複しないようにする
      if (field !== dateCol && !looseAmountKeywords.some(k => field.includes(k))) {
        descCol = field;
      }
    }

    // 金額カラム（未検出の場合のみ）
    if (!amountCol && looseAmountKeywords.some(k => field.includes(k) || lowerField.includes(k.toLowerCase()))) {
      amountCol = field;
    }
  }

  // Level 2で全て見つかったら返す
  if (dateCol && descCol && amountCol) {
    return { date: dateCol, description: descCol, amount: amountCol };
  }

  // === Level 3: データ推論（サンプルデータがある場合） ===
  if (sampleData && sampleData.length > 0) {
    const sample = sampleData[0];

    for (const field of normalizedFields) {
      const value = sample[field] || '';

      // 日付カラムの推論（日付形式にマッチするか）
      if (!dateCol && isDateLike(value)) {
        dateCol = field;
      }

      // 金額カラムの推論（数値形式にマッチするか）
      if (!amountCol && field !== dateCol && isAmountLike(value)) {
        amountCol = field;
      }
    }

    // 残ったカラムを説明として使用
    if (!descCol) {
      for (const field of normalizedFields) {
        if (field !== dateCol && field !== amountCol) {
          descCol = field;
          break;
        }
      }
    }
  }

  if (dateCol && descCol && amountCol) {
    return { date: dateCol, description: descCol, amount: amountCol };
  }

  return null;
}

// 日付らしい値かどうか判定
function isDateLike(value: string): boolean {
  if (!value) return false;
  // 様々な日付形式をチェック
  const datePatterns = [
    /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,  // 2024/01/15, 2024-01-15
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/,  // 01/15/2024
    /^\d{4}年\d{1,2}月\d{1,2}日?$/,        // 2024年1月15日
  ];
  return datePatterns.some(p => p.test(value.trim()));
}

// 金額らしい値かどうか判定
function isAmountLike(value: string): boolean {
  if (!value) return false;
  // 数値、カンマ区切り、円マーク、¥などを含む
  const cleaned = value.replace(/[,，円¥\s]/g, '');
  return /^-?\d+$/.test(cleaned);
}

// 特定のエンコーディングでCSVをパースする内部関数
function parseWithEncoding(
  file: File,
  encoding: string,
  formatId: string
): Promise<ParseResult | null> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding,
      complete: (results) => {
        const fields = results.meta.fields || [];

        // フォーマット検出
        let format: CsvFormat | null = null;
        let columns: { date: string; description: string; amount: string } | null = null;

        if (formatId === 'auto') {
          format = detectFormat(fields);
          if (format) {
            columns = format.columns;
          } else {
            // 汎用検出を試行（サンプルデータも渡す）
            const sampleData = results.data as Record<string, string>[];
            columns = detectGenericColumns(fields, sampleData);
          }
        } else {
          format = csvFormats.formats.find(f => f.id === formatId) || null;
          if (format) {
            columns = format.columns;
          }
        }

        if (!columns) {
          // このエンコーディングでは検出失敗
          resolve(null);
          return;
        }

        // トランザクションをマッピング
        const transactions: RawTransaction[] = (results.data as Record<string, string>[])
          .map((row) => ({
            date: normalizeDate(row[columns!.date] || ''),
            description: (row[columns!.description] || '').trim(),
            amount: parseAmount(row[columns!.amount] || ''),
          }))
          .filter((tx) => tx.date && tx.description && tx.amount > 0);

        if (transactions.length === 0) {
          resolve({
            success: false,
            transactions: [],
            format: format?.name || 'unknown',
            error: '有効な取引データが見つかりませんでした。'
          });
          return;
        }

        resolve({
          success: true,
          transactions,
          format: format?.name || '自動検出'
        });
      },
      error: () => {
        resolve(null);
      }
    });
  });
}

// CSVをパース（複数のエンコーディングを試行）
export async function parseCsv(file: File, formatId: string = 'auto'): Promise<ParseResult> {
  // まずUTF-8で試行（一般的なエンコーディング）
  const utf8Result = await parseWithEncoding(file, 'UTF-8', formatId);
  if (utf8Result) {
    return utf8Result;
  }

  // 次にShift_JISで試行（日本のカード会社がよく使う）
  const sjisResult = await parseWithEncoding(file, 'Shift_JIS', formatId);
  if (sjisResult) {
    return sjisResult;
  }

  // どちらも失敗 - デバッグ用に詳細情報を取得
  const debugInfo = await getDebugInfo(file);
  return {
    success: false,
    transactions: [],
    format: 'unknown',
    error: `CSVフォーマットを検出できませんでした。検出されたカラム: ${debugInfo}`
  };
}

// デバッグ用：CSVのカラム情報を取得
async function getDebugInfo(file: File): Promise<string> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      preview: 1,
      encoding: 'UTF-8',
      complete: (results) => {
        const fields = results.meta.fields || [];
        resolve(fields.join(', ') || '(なし)');
      },
      error: () => {
        resolve('(読み取りエラー)');
      }
    });
  });
}

// 対応フォーマット一覧を取得
export function getSupportedFormats(): CsvFormat[] {
  return csvFormats.formats;
}
