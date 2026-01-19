import { Lightbulb } from 'lucide-react';
import type { SavingTip } from '../../types/result';

interface SavingsTipsProps {
  tips: SavingTip[];
}

export function SavingsTips({ tips }: SavingsTipsProps) {
  return (
    <div className="space-y-3">
      {tips.map((tip) => (
        <div key={tip.id} className="card bg-success/5 border border-success/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-text-main mb-1">
                {tip.title}
              </h3>
              <p className="text-xs text-text-sub leading-relaxed">
                {tip.description}
              </p>
              {tip.estimatedSaving && (
                <p className="mt-2 text-xs font-medium text-success">
                  {tip.estimatedSaving}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
