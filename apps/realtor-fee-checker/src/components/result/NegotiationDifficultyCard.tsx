import { Card } from '@6okuneki/shared';
import { HelpCircle, Check } from 'lucide-react';
import { negotiationDifficultyMessages } from '../../constants/messages';

export function NegotiationDifficultyCard() {
  const { title, points, conclusion } = negotiationDifficultyMessages;

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-text-sub" />
          <h3 className="text-sm font-medium text-text-main">{title}</h3>
        </div>

        <ul className="space-y-2 mb-4">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-text-sub">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <p className="text-sm font-medium text-text-main text-center py-2 bg-bg-base rounded-lg">
          {conclusion}
        </p>
      </div>
    </Card>
  );
}
