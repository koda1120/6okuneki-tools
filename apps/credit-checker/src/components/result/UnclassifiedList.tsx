import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { UnclassifiedItem } from '../../types';

interface UnclassifiedListProps {
  items: UnclassifiedItem[];
}

export function UnclassifiedList({ items }: UnclassifiedListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const displayItems = isExpanded ? items : items.slice(0, 3);
  const hasMore = items.length > 3;

  return (
    <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-text-sub" />
          </div>
          <div>
            <h3 className="font-bold text-text-main">分類できなかった項目</h3>
            <p className="text-sm text-text-sub">{items.length}件</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {displayItems.map((item, index) => (
          <div key={index} className="px-5 py-3 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-main truncate">
                {item.transaction.description}
              </p>
              <p className="text-xs text-text-sub">{item.transaction.date}</p>
            </div>
            <p className="text-sm font-medium text-text-main flex-shrink-0 ml-4">
              {item.transaction.amount.toLocaleString()}円
            </p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-5 py-3 flex items-center justify-center gap-2 text-sm text-accent hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? (
            <>
              閉じる
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              他{items.length - 3}件を表示
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
