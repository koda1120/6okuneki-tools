import { Card } from '@6okuneki/shared';
import { MessageCircle, Check } from 'lucide-react';
import { config } from '../../constants/config';
import { lineCtaMessages } from '../../constants/messages';

export function LineCtaCard() {
  const { title, subtitle, benefits, buttonText, note } = lineCtaMessages;

  return (
    <Card>
      <div className="p-4 bg-gradient-to-br from-[#06C755]/5 to-[#06C755]/10 rounded-xl">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-text-main">{title}</h3>
          <p className="text-sm text-text-sub">{subtitle}</p>
        </div>

        <ul className="space-y-2 mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-text-main">
              <Check className="w-4 h-4 text-line-green flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <a
          href={config.lineOfficialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 bg-line-green text-white font-bold rounded-lg
                   flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          {buttonText}
        </a>

        <p className="text-xs text-text-sub text-center mt-3">{note}</p>
      </div>
    </Card>
  );
}
