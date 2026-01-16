import { TERMS_TEXT } from '../../constants/terms';
import type { TermsScrollBoxProps } from '../../types/registration';

export function TermsScrollBox({ className = '' }: TermsScrollBoxProps) {
  return (
    <div
      className={`h-48 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 text-xs leading-relaxed text-gray-600 ${className}`}
    >
      <h3 className="font-bold mb-2">利用規約</h3>
      <div className="whitespace-pre-wrap">{TERMS_TEXT}</div>
    </div>
  );
}
