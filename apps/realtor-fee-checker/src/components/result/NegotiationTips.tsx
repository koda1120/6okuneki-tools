import { Card } from '@6okuneki/shared';
import { Lightbulb, AlertCircle, Info } from 'lucide-react';
import type { SimpleTip } from '../../types';

interface NegotiationTipsProps {
  tips: SimpleTip[];
}

function getTipIcon(priority: SimpleTip['priority']) {
  switch (priority) {
    case 'high':
      return <AlertCircle className="w-5 h-5 text-warning" />;
    case 'medium':
      return <Lightbulb className="w-5 h-5 text-accent" />;
    default:
      return <Info className="w-5 h-5 text-text-sub" />;
  }
}

export function NegotiationTips({ tips }: NegotiationTipsProps) {
  if (tips.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-sub mb-3">アドバイス</h3>
        <div className="space-y-3">
          {tips.map((tip) => (
            <div key={tip.id} className="flex gap-3">
              <div className="flex-shrink-0 mt-0.5">{getTipIcon(tip.priority)}</div>
              <div>
                <p className="text-sm font-medium text-text-main">{tip.title}</p>
                <p className="text-xs text-text-sub mt-1">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
