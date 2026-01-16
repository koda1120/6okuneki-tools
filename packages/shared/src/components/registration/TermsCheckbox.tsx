import { Check } from 'lucide-react';
import type { TermsCheckboxProps } from '../../types/registration';

export function TermsCheckbox({ checked, onChange, accentColor }: TermsCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-2">
      <div
        className="relative flex-shrink-0 w-5 h-5 mt-0.5 border-2 rounded transition-colors"
        style={{
          borderColor: checked ? accentColor || '#D94343' : '#d1d5db',
          backgroundColor: checked ? accentColor || '#D94343' : 'transparent',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {checked && (
          <Check className="absolute inset-0 w-full h-full p-0.5 text-white" />
        )}
      </div>
      <span className="text-sm text-gray-700 leading-relaxed">
        上記の免責事項および利用規約に同意します
      </span>
    </label>
  );
}
