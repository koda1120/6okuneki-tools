import { AlertTriangle, X } from 'lucide-react';
import { negotiationDifficultyMessages } from '../../constants/messages';

export function NegotiationDifficultyCard() {
  const { points, conclusion } = negotiationDifficultyMessages;

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="text-sm font-bold text-text-main">自分で交渉する場合の注意点</h3>
        </div>

        <ul className="space-y-3 mb-5">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-text-sub">
              <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-sub/50" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="bg-accent/5 border border-accent/20 rounded-card p-4 text-center">
          <p className="text-sm font-bold text-accent">{conclusion}</p>
        </div>
      </div>
    </div>
  );
}
