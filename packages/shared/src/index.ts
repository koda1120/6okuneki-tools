// @6okuneki/shared
// 共通コンポーネント・ロジックをここからエクスポート

// Components - Registration
export { RegistrationForm } from './components/registration/RegistrationForm';
export { AgeSelect } from './components/registration/AgeSelect';
export { GenderSelect } from './components/registration/GenderSelect';
export { EmailInput } from './components/registration/EmailInput';
export { TermsCheckbox } from './components/registration/TermsCheckbox';
export { TermsScrollBox } from './components/registration/TermsScrollBox';

// Components - Common
export { Button } from './components/common/Button';
export { Card } from './components/common/Card';

// Hooks
export { useRegistration } from './hooks/useRegistration';
export { useLocalStorage } from './hooks/useLocalStorage';

// Lib
export { sendRegistration } from './lib/api';
export { validateEmail, sanitize } from './lib/validation';

// Constants
export { DISCLAIMER_TEXT, TERMS_TEXT } from './constants/terms';
export {
  GAS_URL,
  AGE_OPTIONS,
  GENDER_OPTIONS,
  DEFAULT_ACCENT_COLOR,
  DEFAULT_SUBMIT_BUTTON_TEXT,
  DEFAULT_TITLE,
} from './constants/config';

// Types
export type {
  AgeRange,
  Gender,
  RegistrationData,
  RegistrationFormProps,
  AgeSelectProps,
  GenderSelectProps,
  EmailInputProps,
  TermsCheckboxProps,
  TermsScrollBoxProps,
} from './types/registration';

export type { ButtonProps } from './components/common/Button';
export type { CardProps } from './components/common/Card';
