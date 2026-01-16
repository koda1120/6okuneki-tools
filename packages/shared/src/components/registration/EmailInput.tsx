import { Mail } from 'lucide-react';
import type { EmailInputProps } from '../../types/registration';

export function EmailInput({ value, onChange, error, accentColor }: EmailInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        メールアドレス
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="example@email.com"
          maxLength={254}
          className={`w-full h-11 pl-10 pr-3 text-base border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          style={{
            fontSize: '16px', // iOS zoom防止
          }}
          onFocus={(e) => {
            if (!error && accentColor) {
              e.target.style.borderColor = accentColor;
              e.target.style.boxShadow = `0 0 0 2px ${accentColor}33`;
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }
          }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
