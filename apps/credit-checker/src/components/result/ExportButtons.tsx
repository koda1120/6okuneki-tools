import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { DiagnosisResult } from '../../types';

interface ExportButtonsProps {
  result: DiagnosisResult;
}

export function ExportButtons({ result }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  // サマリーテキストを生成
  const generateSummaryText = (): string => {
    const lines: string[] = [];

    lines.push('【クレカ明細チェッカー 診断結果】');
    lines.push('');
    lines.push(`期間: ${result.summary.periodStart} 〜 ${result.summary.periodEnd}`);
    lines.push(`支出合計: ${result.summary.totalAmount.toLocaleString()}円`);
    lines.push(`取引件数: ${result.summary.transactionCount}件`);
    lines.push('');
    lines.push('【カテゴリ別支出】');

    for (const category of result.byCategory) {
      lines.push(`・${category.label}: ${category.totalAmount.toLocaleString()}円 (${category.percentage.toFixed(1)}%)`);
    }

    if (result.subscriptions.length > 0) {
      lines.push('');
      lines.push('【サブスク・定期支払い】');
      lines.push(`月額合計: ${result.subscriptionMonthlyTotal.toLocaleString()}円`);
      for (const sub of result.subscriptions) {
        lines.push(`・${sub.serviceName}: ${sub.monthlyAmount.toLocaleString()}円/月`);
      }
    }

    if (result.reviewTips.length > 0) {
      lines.push('');
      lines.push('【見直しポイント】');
      for (const tip of result.reviewTips) {
        lines.push(`・${tip.title}`);
      }
    }

    return lines.join('\n');
  };

  // CSVをダウンロード
  const handleDownloadCsv = () => {
    const headers = ['日付', '利用先', 'カテゴリ', '金額', '分類方法'];
    const rows = result.transactions.map(tx => [
      tx.date,
      tx.description,
      tx.category || '未分類',
      tx.amount.toString(),
      tx.matchMethod,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `クレカ明細_分析結果_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // テキストをコピー
  const handleCopyText = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // フォールバック
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleDownloadCsv}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-card border border-border rounded-xl text-text-main hover:bg-gray-50 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span className="font-medium">CSVダウンロード</span>
      </button>

      <button
        onClick={handleCopyText}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-card border border-border rounded-xl text-text-main hover:bg-gray-50 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-success" />
            <span className="font-medium text-success">コピーしました</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            <span className="font-medium">テキストをコピー</span>
          </>
        )}
      </button>
    </div>
  );
}
