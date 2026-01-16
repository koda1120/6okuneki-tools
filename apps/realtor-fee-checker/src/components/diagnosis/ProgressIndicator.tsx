import { Check } from 'lucide-react';
import type { DiagnosisStep } from '../../types';

interface ProgressIndicatorProps {
  currentStep: DiagnosisStep;
}

const steps = [
  { step: 1, label: '物件情報' },
  { step: 2, label: '手数料' },
  { step: 3, label: '詳細' },
] as const;

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map(({ step, label }, index) => {
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* ステップ円 */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCompleted ? 'bg-accent text-white' : ''}
                  ${isCurrent ? 'bg-accent text-white' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={`
                  text-xs mt-1
                  ${isCurrent ? 'text-accent font-medium' : 'text-gray-500'}
                `}
              >
                {label}
              </span>
            </div>

            {/* 接続線 */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-8 h-0.5 mx-2 mb-5
                  ${step < currentStep ? 'bg-accent' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
