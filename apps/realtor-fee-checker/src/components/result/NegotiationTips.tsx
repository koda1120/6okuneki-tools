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
      return <Lightbulb className="w-5 h-5 text-gold" />;
    default:
      return <Info className="w-5 h-5 text-text-sub" />;
  }
}

function getTipBgColor(priority: SimpleTip['priority']) {
  switch (priority) {
    case 'high':
      return 'bg-warning/5 border-warning/20';
    case 'medium':
      return 'bg-gold/5 border-gold/20';
    default:
      return 'bg-bg-base border-border';
  }
}

export function NegotiationTips({ tips }: NegotiationTipsProps) {
  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div className="p-5">
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className={`flex gap-3 p-4 rounded-card border ${getTipBgColor(tip.priority)}`}
            >
              <div className="flex-shrink-0 mt-0.5">{getTipIcon(tip.priority)}</div>
              <div>
                <p className="text-sm font-bold text-text-main">{tip.title}</p>
                <p className="text-xs text-text-sub mt-1 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
