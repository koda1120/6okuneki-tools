import { ChevronDown } from 'lucide-react';
import { getSupportedFormats } from '../../lib/csvParser';

interface FormatSelectorProps {
  value: string;
  onChange: (formatId: string) => void;
  disabled?: boolean;
}

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  const formats = getSupportedFormats();

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-text-main mb-2">
        カード会社（任意）
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="
            w-full h-11 pl-4 pr-10
            bg-bg-card border border-border rounded-lg
            text-text-main
            appearance-none
            focus:outline-none focus:border-accent
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <option value="auto">自動検出</option>
          {formats.map((format) => (
            <option key={format.id} value={format.id}>
              {format.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-sub pointer-events-none" />
      </div>
      <p className="text-xs text-text-sub mt-1">
        うまく読み込めない場合はカード会社を選択してください
      </p>
    </div>
  );
}
