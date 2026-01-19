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

// 汎用的なカラム検出（自動検出失敗時のフォールバック）
function detectGenericColumns(fields: string[]): { date: string; description: string; amount: string } | null {
  const normalizedFields = fields.map(f => f.trim());

  // 日付カラムの候補
  const datePatterns = ['日付', '利用日', 'ご利用日', '日時', 'Date', 'DATE'];
  // 説明カラムの候補
  const descPatterns = ['店名', '利用店名', 'ご利用先', '利用先', '摘要', '利用店名・商品名', '説明', 'Description', 'DESCRIPTION'];
  // 金額カラムの候補
  const amountPatterns = ['金額', '利用金額', 'ご利用金額', 'Amount', 'AMOUNT'];

  let dateCol: string | null = null;
  let descCol: string | null = null;
  let amountCol: string | null = null;

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

  if (dateCol && descCol && amountCol) {
    return { date: dateCol, description: descCol, amount: amountCol };
  }

  return null;
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
            // 汎用検出を試行
            columns = detectGenericColumns(fields);
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
