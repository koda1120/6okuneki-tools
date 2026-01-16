import { AlertTriangle } from 'lucide-react';
import type { RegistrationFormProps } from '../../types/registration';
import { useRegistration } from '../../hooks/useRegistration';
import { DISCLAIMER_TEXT } from '../../constants/terms';
import {
  DEFAULT_ACCENT_COLOR,
  DEFAULT_SUBMIT_BUTTON_TEXT,
  DEFAULT_TITLE,
} from '../../constants/config';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { AgeSelect } from './AgeSelect';
import { GenderSelect } from './GenderSelect';
import { EmailInput } from './EmailInput';
import { TermsScrollBox } from './TermsScrollBox';
import { TermsCheckbox } from './TermsCheckbox';

export function RegistrationForm({
  siteName,
  onComplete,
  title = DEFAULT_TITLE,
  description,
  accentColor = DEFAULT_ACCENT_COLOR,
  submitButtonText = DEFAULT_SUBMIT_BUTTON_TEXT,
  showGender = true,
  localStorageKey,
}: RegistrationFormProps) {
  const storageKey = localStorageKey || `6okuniki_${siteName.replace(/\s/g, '_')}_registered`;

  const {
    age,
    gender,
    email,
    agreed,
    emailError,
    isSubmitting,
    setAge,
    setGender,
    setEmail,
    setAgreed,
    handleSubmit,
    isFormValid,
  } = useRegistration({
    siteName,
    localStorageKey: storageKey,
    onComplete,
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          {/* ヘッダー */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 mb-2">{title}</h1>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>

          {/* フォーム */}
          <div className="space-y-4">
            <AgeSelect value={age} onChange={setAge} accentColor={accentColor} />

            {showGender && (
              <GenderSelect
                value={gender}
                onChange={setGender}
                accentColor={accentColor}
              />
            )}

            <EmailInput
              value={email}
              onChange={setEmail}
              error={emailError}
              accentColor={accentColor}
            />
          </div>

          {/* 免責事項 */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-800 mb-1">免責事項</h3>
                <p className="text-xs text-amber-700 leading-relaxed whitespace-pre-wrap">
                  {DISCLAIMER_TEXT}
                </p>
              </div>
            </div>
          </div>

          {/* 利用規約 */}
          <div className="mt-4">
            <TermsScrollBox />
          </div>

          {/* 同意チェックボックス */}
          <div className="mt-4">
            <TermsCheckbox
              checked={agreed}
              onChange={setAgreed}
              accentColor={accentColor}
            />
          </div>

          {/* 送信ボタン */}
          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              size="lg"
              accentColor={accentColor}
              disabled={!isFormValid}
              isLoading={isSubmitting}
              onClick={handleSubmit}
              className="w-full"
            >
              {submitButtonText}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
