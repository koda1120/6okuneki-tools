// 追加テスト用PDF生成スクリプト
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDataDir = path.join(__dirname, '../test-data');

interface Transaction {
  date: string;
  desc: string;
  amount: number;
}

function generatePdf(filename: string, title: string, transactions: Transaction[]) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const output = fs.createWriteStream(path.join(testDataDir, filename));
  doc.pipe(output);

  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text('December 2024', { align: 'center' });
  doc.moveDown(2);

  doc.fontSize(9);
  doc.text('DATE          DESCRIPTION                         AMOUNT', 50);
  doc.moveDown();
  doc.text('--------------------------------------------------------------', 50);
  doc.moveDown(0.5);

  let total = 0;
  for (const t of transactions) {
    const line = `${t.date}    ${t.desc.padEnd(35)}  ${t.amount.toLocaleString().padStart(10)}`;
    doc.text(line, 50);
    doc.moveDown(0.5);
    total += t.amount;
  }

  doc.moveDown();
  doc.text('--------------------------------------------------------------', 50);
  doc.moveDown(0.5);
  doc.fontSize(11).text(`TOTAL: ${total.toLocaleString()} JPY`, { align: 'right' });

  doc.end();
  console.log(`Generated: ${filename}`);
}

// サブスク多めPDF
generatePdf('サブスク多め_テスト.pdf', 'Subscription Heavy Statement', [
  { date: '2024/12/01', desc: 'Netflix', amount: 1490 },
  { date: '2024/12/01', desc: 'Spotify', amount: 980 },
  { date: '2024/12/01', desc: 'Amazon Prime', amount: 600 },
  { date: '2024/12/01', desc: 'YouTube Premium', amount: 1280 },
  { date: '2024/12/01', desc: 'Apple Music', amount: 1080 },
  { date: '2024/12/01', desc: 'Disney Plus', amount: 990 },
  { date: '2024/12/01', desc: 'U-NEXT', amount: 2189 },
  { date: '2024/12/01', desc: 'DAZN', amount: 3000 },
  { date: '2024/12/01', desc: 'Hulu', amount: 1026 },
  { date: '2024/12/01', desc: 'Adobe Creative Cloud', amount: 6480 },
  { date: '2024/12/05', desc: 'Seven Eleven', amount: 450 },
  { date: '2024/12/10', desc: 'Lawson', amount: 380 },
]);

// 外食多めPDF
generatePdf('外食多め_テスト.pdf', 'Dining Heavy Statement', [
  { date: '2024/12/01', desc: 'McDonald Shibuya', amount: 980 },
  { date: '2024/12/03', desc: 'Yoshinoya Shinjuku', amount: 650 },
  { date: '2024/12/05', desc: 'Matsuya Ikebukuro', amount: 550 },
  { date: '2024/12/07', desc: 'Sukiya Shinagawa', amount: 620 },
  { date: '2024/12/09', desc: 'Gusto Nakano', amount: 1100 },
  { date: '2024/12/11', desc: 'Saizeriya Takadanobaba', amount: 980 },
  { date: '2024/12/13', desc: 'Starbucks Marunouchi', amount: 780 },
  { date: '2024/12/15', desc: 'Torikizoku Shimbashi', amount: 3200 },
  { date: '2024/12/17', desc: 'Isomaru Suisan Shinjuku', amount: 4500 },
  { date: '2024/12/19', desc: 'Yakiniku King Tachikawa', amount: 5980 },
  { date: '2024/12/21', desc: 'Sushiro Yokohama', amount: 2350 },
  { date: '2024/12/23', desc: 'Marugame Seimen Akihabara', amount: 590 },
  { date: '2024/12/25', desc: 'CoCo Ichibanya Asakusa', amount: 980 },
  { date: '2024/12/27', desc: 'Gyoza no Ohsho', amount: 1100 },
  { date: '2024/12/29', desc: 'Ringer Hut Itabashi', amount: 890 },
]);

// 公共料金中心PDF
generatePdf('公共料金_テスト.pdf', 'Utility Bills Statement', [
  { date: '2024/12/05', desc: 'Tokyo Electric Power', amount: 12500 },
  { date: '2024/12/05', desc: 'Tokyo Gas', amount: 6800 },
  { date: '2024/12/05', desc: 'Tokyo Waterworks', amount: 4200 },
  { date: '2024/12/10', desc: 'NTT Docomo', amount: 8900 },
  { date: '2024/12/10', desc: 'SoftBank Mobile', amount: 7500 },
  { date: '2024/12/15', desc: 'NHK', amount: 2200 },
  { date: '2024/12/15', desc: 'NURO Hikari', amount: 5200 },
  { date: '2024/12/20', desc: 'Insurance Premium', amount: 8500 },
  { date: '2024/12/25', desc: 'Life Insurance', amount: 15000 },
  { date: '2024/12/28', desc: 'AEON Shinagawa', amount: 5800 },
]);

// 交通費中心PDF
generatePdf('交通費_テスト.pdf', 'Transportation Statement', [
  { date: '2024/12/01', desc: 'Mobile Suica Charge', amount: 10000 },
  { date: '2024/12/03', desc: 'JR East Commuter Pass', amount: 45800 },
  { date: '2024/12/07', desc: 'Taxi Nihon Kotsu', amount: 3500 },
  { date: '2024/12/10', desc: 'Uber', amount: 4200 },
  { date: '2024/12/14', desc: 'Tokaido Shinkansen', amount: 14500 },
  { date: '2024/12/15', desc: 'ANA Flight', amount: 35000 },
  { date: '2024/12/17', desc: 'JAL Flight', amount: 28000 },
  { date: '2024/12/20', desc: 'Airport Limousine Bus', amount: 1300 },
  { date: '2024/12/24', desc: 'Car Rental Times', amount: 8500 },
  { date: '2024/12/27', desc: 'Gasoline ENEOS', amount: 6800 },
  { date: '2024/12/30', desc: 'ETC Highway', amount: 1320 },
]);

console.log('\nAll additional PDFs generated!');
