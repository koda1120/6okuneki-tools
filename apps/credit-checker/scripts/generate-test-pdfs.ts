// テスト用PDF生成スクリプト
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, '../test-data');

// 楽天カード風のPDF
function generateRakutenPdf() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const output = fs.createWriteStream(path.join(testDataDir, '楽天カード_テスト明細.pdf'));
  doc.pipe(output);

  // フォントは埋め込まないため英数字のみで構成
  doc.fontSize(20).text('Rakuten Card Statement', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text('2024/12 Statement', { align: 'center' });
  doc.moveDown(2);

  // テーブルヘッダー
  doc.fontSize(10);
  doc.text('Date', 50, doc.y, { continued: true, width: 100 });
  doc.text('Description', 150, doc.y, { continued: true, width: 250 });
  doc.text('Amount (JPY)', 400, doc.y, { align: 'right' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  const transactions = [
    { date: '2024/12/01', desc: 'Amazon.co.jp', amount: 3280 },
    { date: '2024/12/02', desc: 'Lawson Shibuya', amount: 580 },
    { date: '2024/12/03', desc: 'Starbucks Shinjuku', amount: 650 },
    { date: '2024/12/05', desc: 'Netflix', amount: 1490 },
    { date: '2024/12/06', desc: 'Uber Eats', amount: 2100 },
    { date: '2024/12/08', desc: 'Uniqlo Ginza', amount: 4990 },
    { date: '2024/12/10', desc: 'Rakuten Ichiba', amount: 5680 },
    { date: '2024/12/12', desc: 'FamilyMart Meguro', amount: 420 },
    { date: '2024/12/14', desc: 'McDonald Ikebukuro', amount: 890 },
    { date: '2024/12/15', desc: 'Spotify', amount: 980 },
    { date: '2024/12/17', desc: 'Matsumoto Kiyoshi', amount: 1850 },
    { date: '2024/12/18', desc: 'Toho Cinemas', amount: 1900 },
    { date: '2024/12/20', desc: 'Yodobashi Camera', amount: 12800 },
    { date: '2024/12/22', desc: 'Sukiya Shinjuku', amount: 620 },
    { date: '2024/12/24', desc: 'Amazon Prime', amount: 600 },
    { date: '2024/12/25', desc: 'Gusto Nakano', amount: 980 },
    { date: '2024/12/27', desc: 'Seven Eleven Ebisu', amount: 350 },
    { date: '2024/12/28', desc: 'Disney Plus', amount: 990 },
    { date: '2024/12/30', desc: 'Aeon Mall', amount: 6500 },
  ];

  let total = 0;
  for (const t of transactions) {
    doc.text(t.date, 50, doc.y, { continued: true, width: 100 });
    doc.text(t.desc, 150, doc.y, { continued: true, width: 250 });
    doc.text(t.amount.toLocaleString(), 400, doc.y, { align: 'right' });
    doc.moveDown(0.8);
    total += t.amount;
  }

  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(12).text('Total:', 50, doc.y, { continued: true, width: 350 });
  doc.text(total.toLocaleString() + ' JPY', 400, doc.y, { align: 'right' });

  doc.end();
  console.log('Generated: 楽天カード_テスト明細.pdf');
}

// 三井住友カード風のPDF
function generateSmbc() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const output = fs.createWriteStream(path.join(testDataDir, '三井住友カード_テスト明細.pdf'));
  doc.pipe(output);

  doc.fontSize(18).text('SMBC Card Statement', { align: 'center' });
  doc.moveDown();
  doc.fontSize(11).text('Statement Period: 2024/12/01 - 2024/12/31', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(9);
  const startY = doc.y;
  doc.text('Use Date', 50, startY);
  doc.text('Merchant', 130, startY);
  doc.text('Amount', 480, startY, { align: 'right' });
  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  const transactions = [
    { date: '2024/12/01', desc: 'Seven Eleven Shibuya', amount: 580 },
    { date: '2024/12/02', desc: 'Starbucks Minami', amount: 650 },
    { date: '2024/12/03', desc: 'AMAZON.CO.JP', amount: 3980 },
    { date: '2024/12/05', desc: 'NETFLIX.COM', amount: 1490 },
    { date: '2024/12/06', desc: 'McDonald Ikebukuro', amount: 890 },
    { date: '2024/12/07', desc: 'FamilyMart Meguro', amount: 320 },
    { date: '2024/12/08', desc: 'UNIQLO Ginza', amount: 5990 },
    { date: '2024/12/10', desc: 'Mobile Suica', amount: 3000 },
    { date: '2024/12/10', desc: 'Rakuten Ichiba', amount: 2480 },
    { date: '2024/12/12', desc: 'Doutor Coffee', amount: 380 },
    { date: '2024/12/13', desc: 'Welcia Shimbashi', amount: 1250 },
    { date: '2024/12/14', desc: 'Matsuya Gotanda', amount: 550 },
    { date: '2024/12/15', desc: 'Tokyo Denryoku EP', amount: 8500 },
    { date: '2024/12/15', desc: 'SoftBank', amount: 6980 },
    { date: '2024/12/16', desc: 'Lawson Ebisu', amount: 450 },
    { date: '2024/12/17', desc: 'Gusto Nakano', amount: 980 },
    { date: '2024/12/18', desc: 'AMAZON PRIME', amount: 600 },
    { date: '2024/12/20', desc: 'Yodobashi Camera', amount: 24800 },
    { date: '2024/12/21', desc: 'Sukiya Shinjuku', amount: 620 },
    { date: '2024/12/22', desc: 'Tullys Jiyugaoka', amount: 580 },
    { date: '2024/12/23', desc: 'Tokyo Gas', amount: 4200 },
    { date: '2024/12/24', desc: 'Microsoft 365', amount: 1490 },
    { date: '2024/12/25', desc: 'TOHO Cinemas', amount: 1900 },
    { date: '2024/12/26', desc: 'Can Do Harajuku', amount: 220 },
    { date: '2024/12/27', desc: 'Nakau Hamamatsucho', amount: 490 },
    { date: '2024/12/28', desc: 'Spotify', amount: 980 },
    { date: '2024/12/29', desc: 'Matsumoto Kiyoshi', amount: 1850 },
    { date: '2024/12/30', desc: 'Kappa Sushi', amount: 2400 },
  ];

  let total = 0;
  for (const t of transactions) {
    doc.text(t.date, 50, doc.y);
    doc.text(t.desc, 130, doc.y - 11);
    doc.text(t.amount.toLocaleString(), 480, doc.y - 11, { align: 'right' });
    doc.moveDown(0.7);
    total += t.amount;
  }

  doc.moveDown();
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(11).text('Total Amount: ' + total.toLocaleString() + ' JPY', { align: 'right' });

  doc.end();
  console.log('Generated: 三井住友カード_テスト明細.pdf');
}

// イオンカード風のPDF
function generateAeon() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const output = fs.createWriteStream(path.join(testDataDir, 'イオンカード_テスト明細.pdf'));
  doc.pipe(output);

  doc.fontSize(20).text('AEON Card Statement', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text('December 2024', { align: 'center' });
  doc.moveDown(2);

  // シンプルなテーブル形式
  doc.fontSize(9);
  doc.text('DATE          STORE                              AMOUNT', 50);
  doc.moveDown();
  doc.text('------------------------------------------------------------', 50);
  doc.moveDown(0.5);

  const transactions = [
    { date: '2024/12/01', desc: 'AEON Shinagawa Seaside', amount: 4280 },
    { date: '2024/12/02', desc: 'Ministop Osaki', amount: 420 },
    { date: '2024/12/03', desc: 'Welcia Gotanda', amount: 2150 },
    { date: '2024/12/04', desc: 'My Basket Togoshi', amount: 890 },
    { date: '2024/12/05', desc: 'Hulu', amount: 1026 },
    { date: '2024/12/06', desc: 'MaxValu Kamata', amount: 3650 },
    { date: '2024/12/07', desc: 'Daiei Oimachi', amount: 2890 },
    { date: '2024/12/08', desc: 'AEON Mall Makuhari', amount: 8900 },
    { date: '2024/12/10', desc: 'WAON Charge', amount: 5000 },
    { date: '2024/12/11', desc: 'Seria AEON', amount: 550 },
    { date: '2024/12/12', desc: 'AEON Cinema', amount: 1800 },
    { date: '2024/12/13', desc: 'Saizeriya Shinagawa', amount: 1100 },
    { date: '2024/12/15', desc: 'Disney Plus', amount: 990 },
    { date: '2024/12/16', desc: 'Welcia Omori', amount: 1680 },
    { date: '2024/12/17', desc: 'AEON Shinonome', amount: 5420 },
    { date: '2024/12/18', desc: 'DAZN', amount: 3000 },
    { date: '2024/12/20', desc: 'MaxValu Kinshicho', amount: 4200 },
    { date: '2024/12/22', desc: 'AEON Pharmacy', amount: 2300 },
    { date: '2024/12/24', desc: 'My Basket Tsukishima', amount: 680 },
    { date: '2024/12/25', desc: 'AEON Pet', amount: 3500 },
    { date: '2024/12/27', desc: 'U-NEXT', amount: 2189 },
    { date: '2024/12/28', desc: 'AEON Kasai', amount: 6800 },
    { date: '2024/12/30', desc: 'Daiei Kiba', amount: 4100 },
  ];

  let total = 0;
  for (const t of transactions) {
    const line = `${t.date}    ${t.desc.padEnd(30)}    ${t.amount.toLocaleString().padStart(8)}`;
    doc.text(line, 50);
    doc.moveDown(0.6);
    total += t.amount;
  }

  doc.moveDown();
  doc.text('------------------------------------------------------------', 50);
  doc.moveDown(0.5);
  doc.fontSize(11).text(`TOTAL: ${total.toLocaleString()} JPY`, 50);

  doc.end();
  console.log('Generated: イオンカード_テスト明細.pdf');
}

// 実行
if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

generateRakutenPdf();
generateSmbc();
generateAeon();

console.log('\nAll test PDFs generated successfully!');
