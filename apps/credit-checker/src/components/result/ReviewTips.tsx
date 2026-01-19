import { AlertTriangle, Lightbulb, Info } from 'lucide-react';
import type { ReviewTip } from '../../types';

interface ReviewTipsProps {
  tips: ReviewTip[];
}

export function ReviewTips({ tips }: ReviewTipsProps) {
  if (tips.length === 0) {
    return null;
  }

  const getSeverityStyles = (severity: ReviewTip['severity']) => {
    switch (severity) {
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          icon: AlertTriangle,
          iconColor: 'text-warning',
        };
      case 'suggestion':
        return {
          bg: 'bg-accent-light',
          border: 'border-accent/30',
          icon: Lightbulb,
          iconColor: 'text-accent',
        };
      default:
        return {
          bg: 'bg-bg-base',
          border: 'border-border',
          icon: Info,
          iconColor: 'text-text-sub',
        };
    }
  };

  return (
    <div className="space-y-3">
      {tips.map((tip) => {
        const styles = getSeverityStyles(tip.severity);
        const Icon = styles.icon;

        return (
          <div
            key={tip.id}
            className={`${styles.bg} border ${styles.border} rounded-soft p-4`}
          >
            <div className="flex gap-3">
              <div className={`flex-shrink-0 w-10 h-10 ${styles.bg} rounded-full flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${styles.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-main mb-1">{tip.title}</p>
                <p className="text-sm text-text-sub leading-relaxed">{tip.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
