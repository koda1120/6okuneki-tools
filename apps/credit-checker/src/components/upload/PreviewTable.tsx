import type { RawTransaction } from '../../types';

interface PreviewTableProps {
  transactions: RawTransaction[];
  format: string;
}

export function PreviewTable({ transactions, format }: PreviewTableProps) {
  const previewItems = transactions.slice(0, 5);
  const hasMore = transactions.length > 5;

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-text-main">プレビュー</h3>
          <span className="text-sm text-text-sub">
            {format} / {transactions.length}件
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left font-medium text-text-sub whitespace-nowrap">
                日付
              </th>
              <th className="px-4 py-2 text-left font-medium text-text-sub whitespace-nowrap">
                利用先
              </th>
              <th className="px-4 py-2 text-right font-medium text-text-sub whitespace-nowrap">
                金額
              </th>
            </tr>
          </thead>
          <tbody>
            {previewItems.map((tx, index) => (
              <tr key={index} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2 text-text-main whitespace-nowrap">
                  {tx.date}
                </td>
                <td className="px-4 py-2 text-text-main">
                  <span className="line-clamp-1">{tx.description}</span>
                </td>
                <td className="px-4 py-2 text-right text-text-main whitespace-nowrap">
                  {tx.amount.toLocaleString()}円
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-4 py-2 text-center text-sm text-text-sub bg-gray-50">
          他 {transactions.length - 5} 件
        </div>
      )}
    </div>
  );
}
