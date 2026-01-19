// PDFデバッグスクリプト - テキスト抽出結果を確認
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// pdfjs-distをdynamic importで読み込む（Node.js用legacy build）
async function main() {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  // PDFファイルパス
  const pdfPath = path.join(__dirname, '../test-data/公共料金_テスト.pdf');

  console.log('='.repeat(60));
  console.log('PDF Debug: イオンカード_テスト明細.pdf');
  console.log('='.repeat(60));

  // PDFを読み込み
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  console.log(`\nページ数: ${pdf.numPages}`);
  console.log('\n--- 抽出されたテキスト ---\n');

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    console.log(`\n[Page ${i}]`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // 各テキストアイテムを表示（Y座標付き）
    console.log('\n各テキストアイテム (Y座標付き):');
    textContent.items.forEach((item: any, index: number) => {
      if (item.str && item.str.trim()) {
        const y = item.transform ? Math.round(item.transform[5]) : 0;
        console.log(`  [${index}] Y=${y} "${item.str}"`);
      }
    });

    // Y座標でグループ化して行を構築（新しいロジック）
    const items = textContent.items as any[];
    const sortedItems = [...items].sort((a, b) => {
      const yA = a.transform ? a.transform[5] : 0;
      const yB = b.transform ? b.transform[5] : 0;
      return yB - yA;
    });

    let currentY: number | null = null;
    const lines: string[] = [];
    let currentLine: string[] = [];

    for (const item of sortedItems) {
      if (!item.str) continue;
      const y = item.transform ? Math.round(item.transform[5]) : 0;

      if (currentY !== null && Math.abs(y - currentY) > 5) {
        if (currentLine.length > 0) {
          lines.push(currentLine.join(' '));
        }
        currentLine = [];
      }
      currentLine.push(item.str);
      currentY = y;
    }
    if (currentLine.length > 0) {
      lines.push(currentLine.join(' '));
    }

    fullText += lines.join('\n') + '\n';

    console.log('\n行ごとに分割されたテキスト:');
    lines.forEach((line, idx) => {
      console.log(`  [Line ${idx + 1}] ${line}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('パターンマッチング結果');
  console.log('='.repeat(60));

  // 日付パターン
  const DATE_PATTERNS = [
    /(\d{4})[\/\-年](\d{1,2})[\/\-月](\d{1,2})日?/g,
    /(\d{1,2})[\/\-月](\d{1,2})日?/g,
  ];

  // 金額パターン
  const AMOUNT_PATTERNS = [
    /[¥￥]?\s*([\d,]+)\s*円?/g,
    /(\d{1,3}(?:,\d{3})+|\d+)(?:\s*円)?/g,
  ];

  const lines = fullText.split('\n');

  interface Transaction {
    date: string;
    description: string;
    amount: number;
    rawLine: string;
  }

  const transactions: Transaction[] = [];

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
          const year = match[1];
          const month = match[2].padStart(2, '0');
          const day = match[3].padStart(2, '0');
          dateStr = `${year}/${month}/${day}`;
        } else if (match[1] && match[2]) {
          const year = new Date().getFullYear();
          const month = match[1].padStart(2, '0');
          const day = match[2].padStart(2, '0');
          dateStr = `${year}/${month}/${day}`;
        }
        break;
      }
    }

    if (!dateStr) continue;

    // 金額を探す
    const amountMatches: { value: number; index: number; raw: string }[] = [];

    for (const pattern of AMOUNT_PATTERNS) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(trimmedLine)) !== null) {
        const value = parseInt(match[1].replace(/,/g, ''), 10);
        if (value > 0 && value < 10000000) {
          amountMatches.push({ value, index: match.index, raw: match[0] });
        }
      }
    }

    if (amountMatches.length === 0) continue;

    amountMatches.sort((a, b) => b.index - a.index);
    const amount = amountMatches[0].value;

    // 説明文
    const dateIndex = trimmedLine.indexOf(dateMatch![0]);
    const amountIndex = amountMatches[0].index;

    let description = '';
    if (dateIndex < amountIndex) {
      description = trimmedLine
        .substring(dateIndex + dateMatch![0].length, amountIndex)
        .replace(/[¥￥\d,円]/g, '')
        .trim();
    }

    if (description.length < 2) continue;

    const skipKeywords = ['ご利用日', '利用日', '日付', '支払い', '請求', '合計', 'お支払い', '残高'];
    if (skipKeywords.some(kw => description.includes(kw))) continue;

    transactions.push({
      date: dateStr,
      description,
      amount,
      rawLine: trimmedLine,
    });
  }

  console.log(`\n抽出された取引: ${transactions.length}件\n`);

  let total = 0;
  transactions.forEach((tx, i) => {
    console.log(`[${i + 1}] ${tx.date} | ${tx.description.padEnd(30)} | ¥${tx.amount.toLocaleString()}`);
    console.log(`    Raw: "${tx.rawLine}"`);
    total += tx.amount;
  });

  console.log('\n' + '-'.repeat(60));
  console.log(`合計: ¥${total.toLocaleString()}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
