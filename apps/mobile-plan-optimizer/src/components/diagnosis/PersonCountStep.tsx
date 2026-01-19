import { useState } from 'react';
import { Users, User, ChevronRight } from 'lucide-react';

interface PersonCountStepProps {
  onComplete: (count: number) => void;
}

export function PersonCountStep({ onComplete }: PersonCountStepProps) {
  const [count, setCount] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setCount(value);
  };

  const handleNext = () => {
    if (count !== null) {
      onComplete(count);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-lg mb-4">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-main mb-2">
          何人分の診断をしますか？
        </h2>
        <p className="text-sm text-text-sub">
          ご家族でまとめて診断すると、家族割の適用も比較できます
        </p>
      </div>

      <div className="space-y-3">
        {/* 1人 */}
        <button
          onClick={() => handleSelect(1)}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all tap-target focus-ring ${
            count === 1
              ? 'border-accent bg-accent/5'
              : 'border-border bg-white hover:border-accent/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              count === 1 ? 'bg-accent text-white' : 'bg-gray-100 text-text-sub'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-text-main">1人</p>
              <p className="text-sm text-text-sub">自分だけ</p>
            </div>
            {count === 1 && (
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* 2〜4人 */}
        {[2, 3, 4].map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all tap-target focus-ring ${
              count === num
                ? 'border-accent bg-accent/5'
                : 'border-border bg-white hover:border-accent/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                count === num ? 'bg-accent text-white' : 'bg-gray-100 text-text-sub'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-text-main">{num}人</p>
                <p className="text-sm text-text-sub">
                  {num === 2 ? '2人家族' : `${num}人家族`}
                </p>
              </div>
              {count === num && (
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}

        {/* 5人以上 */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-text-sub mb-2">
            5人以上の場合
          </label>
          <select
            value={count !== null && count >= 5 ? count : ''}
            onChange={(e) => handleSelect(Number(e.target.value))}
            className="w-full h-12 px-4 rounded-lg border-2 border-border bg-white text-text-main focus:border-accent focus:outline-none"
          >
            <option value="">選択してください</option>
            {[5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num}人
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 次へボタン */}
      <button
        onClick={handleNext}
        disabled={count === null}
        className={`w-full h-14 rounded-lg font-bold text-white flex items-center justify-center gap-2 tap-target focus-ring transition-all ${
          count !== null
            ? 'bg-accent hover:bg-accent/90'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        次へ
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
