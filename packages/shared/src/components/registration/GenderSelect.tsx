import { ChevronDown } from 'lucide-react';
import type { GenderSelectProps, Gender } from '../../types/registration';
import { GENDER_OPTIONS } from '../../constants/config';

export function GenderSelect({ value, onChange, accentColor }: GenderSelectProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        性別
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (val) onChange(val as Gender);
          }}
          className="w-full h-11 pl-3 pr-10 text-base border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2"
          style={{
            fontSize: '16px', // iOS zoom防止
          }}
          onFocus={(e) => {
            if (accentColor) {
              e.target.style.borderColor = accentColor;
              e.target.style.boxShadow = `0 0 0 2px ${accentColor}33`;
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">選択してください</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
