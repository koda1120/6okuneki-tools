export type AgeRange =
  | '0-10'
  | '11-20'
  | '21-30'
  | '31-40'
  | '41-50'
  | '51-60'
  | '61-70'
  | '70+';

export type Gender = 'male' | 'female' | 'other' | 'unknown';

export interface RegistrationData {
  age: AgeRange;
  gender: Gender;
  email: string;
  siteName: string;
}

export interface RegistrationFormProps {
  /** GASに送信するツール識別名（必須） */
  siteName: string;
  /** 登録完了時のコールバック */
  onComplete: (data: RegistrationData) => void;
  /** 画面タイトル */
  title?: string;
  /** 説明文 */
  description?: string;
  /** アクセントカラー */
  accentColor?: string;
  /** ボタンテキスト */
  submitButtonText?: string;
  /** 性別表示ON/OFF（デフォルト: true） */
  showGender?: boolean;
  /** 登録済みフラグ保存キー */
  localStorageKey?: string;
}

export interface AgeSelectProps {
  value: AgeRange | '';
  onChange: (value: AgeRange) => void;
  accentColor?: string;
}

export interface GenderSelectProps {
  value: Gender | '';
  onChange: (value: Gender) => void;
  accentColor?: string;
}

export interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  accentColor?: string;
}

export interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  accentColor?: string;
}

export interface TermsScrollBoxProps {
  className?: string;
}
