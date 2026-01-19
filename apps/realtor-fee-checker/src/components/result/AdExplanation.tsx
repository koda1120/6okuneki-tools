import { BookOpen } from 'lucide-react';
import { adExplanationMessages } from '../../constants/messages';

export function AdExplanation() {
  const { content } = adExplanationMessages;

  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-accent" />
          <span className="text-sm font-bold text-text-main">ADとは？</span>
        </div>
        <p className="text-sm text-text-sub whitespace-pre-line leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
