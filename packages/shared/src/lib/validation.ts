/**
 * メールアドレスのバリデーション
 * RFC 5322準拠の簡易チェック + 最大254文字
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email) && email.length <= 254;
}

/**
 * HTMLサニタイズ処理
 * XSS対策として特殊文字をエスケープ
 */
export function sanitize(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
