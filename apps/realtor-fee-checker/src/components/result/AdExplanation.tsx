import { Card } from '@6okuneki/shared';
import { Info } from 'lucide-react';
import { adExplanationMessages } from '../../constants/messages';

export function AdExplanation() {
  const { title, content } = adExplanationMessages;

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-text-main">{title}</span>
        </div>
        <p className="text-sm text-text-sub whitespace-pre-line">{content}</p>
      </div>
    </Card>
  );
}
