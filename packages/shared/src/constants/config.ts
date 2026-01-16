export const GAS_URL =
  'https://script.google.com/macros/s/AKfycbxpH8mJWk57MDoO5Q0rUdGzQ2GytKhKqjNm1i35j_sQaAFkky6Toi9WmQhG1DcIxWFmVA/exec';

export const AGE_OPTIONS = [
  { value: '0-10', label: '10歳以下' },
  { value: '11-20', label: '11〜20歳' },
  { value: '21-30', label: '21〜30歳' },
  { value: '31-40', label: '31〜40歳' },
  { value: '41-50', label: '41〜50歳' },
  { value: '51-60', label: '51〜60歳' },
  { value: '61-70', label: '61〜70歳' },
  { value: '70+', label: '70歳以上' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
  { value: 'unknown', label: '回答しない' },
] as const;

export const DEFAULT_ACCENT_COLOR = '#D94343';
export const DEFAULT_SUBMIT_BUTTON_TEXT = '同意して始める';
export const DEFAULT_TITLE = 'ユーザー登録';
