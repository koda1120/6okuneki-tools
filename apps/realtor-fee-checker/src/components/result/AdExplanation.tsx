import { useState } from 'react';
import { Card } from '@6okuneki/shared';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { adExplanationMessages } from '../../constants/messages';

export function AdExplanation() {
  const [isOpen, setIsOpen] = useState(false);
  const { title, content } = adExplanationMessages;

  return (
    <Card>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          <span className="text-sm font-medium text-text-main">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-text-sub" />
        ) : (
          <ChevronDown className="w-5 h-5 text-text-sub" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-border">
          <p className="text-sm text-text-sub whitespace-pre-line pt-4">{content}</p>
        </div>
      )}
    </Card>
  );
}
