// 診断ウィザードで使用する選択肢の定義

// データ使用量選択肢（プランの容量に合わせた選択肢）
export const DATA_USAGE_OPTIONS = [
  { value: '1gb', label: '1GB' },
  { value: '3gb', label: '3GB' },
  { value: '5gb', label: '5GB' },
  { value: '10gb', label: '10GB' },
  { value: '15gb', label: '15GB' },
  { value: '20gb', label: '20GB' },
  { value: '30gb', label: '30GB' },
  { value: '50gb', label: '50GB' },
  { value: 'unlimited', label: '無制限' },
] as const;

// 通話頻度選択肢
export const CALL_FREQUENCY_OPTIONS = [
  { value: 'rarely', label: 'ほぼしない', description: 'LINEで十分' },
  { value: 'sometimes', label: 'たまにする', description: '短い通話が多い' },
  { value: 'often', label: 'よくする', description: '5分以内の通話が多い' },
  { value: 'long', label: '長電話が多い', description: 'かけ放題がほしい' },
] as const;

// 現在のキャリア選択肢
export const CURRENT_CARRIER_OPTIONS = [
  { value: 'docomo', label: 'ドコモ' },
  { value: 'au', label: 'au' },
  { value: 'softbank', label: 'ソフトバンク' },
  { value: 'rakuten', label: '楽天モバイル' },
  { value: 'ymobile', label: 'Y!mobile' },
  { value: 'uq', label: 'UQ mobile' },
  { value: 'mvno', label: 'その他格安SIM' },
  { value: 'unknown', label: 'わからない/新規' },
] as const;

// 光回線選択肢
export const HOME_INTERNET_OPTIONS = [
  { value: 'docomo_hikari', label: 'ドコモ光' },
  { value: 'au_hikari', label: 'auひかり / eo光など' },
  { value: 'softbank_hikari', label: 'ソフトバンク光' },
  { value: 'nuro', label: 'NURO光' },
  { value: 'other', label: 'その他の光回線' },
  { value: 'none', label: 'なし / わからない' },
] as const;

// クレジットカード選択肢（複数選択可能）
export const CREDIT_CARD_OPTIONS = [
  { value: 'd_card', label: 'dカード' },
  { value: 'au_pay', label: 'au PAYカード' },
  { value: 'paypay', label: 'PayPayカード' },
  { value: 'rakuten', label: '楽天カード' },
] as const;

// 家族人数選択肢（本人含む）
export const FAMILY_MEMBERS_OPTIONS = [
  { value: 1, label: '1人（自分だけ）' },
  { value: 2, label: '2人' },
  { value: 3, label: '3人' },
  { value: 4, label: '4人' },
  { value: 5, label: '5人以上' },
] as const;

// 重視ポイント選択肢
export const PRIORITY_OPTIONS = [
  { value: 'price', label: '料金の安さ', description: 'とにかく安くしたい' },
  { value: 'quality', label: '通信品質', description: '速度・安定性重視' },
  { value: 'support', label: 'サポート', description: '店舗や電話で相談したい' },
  { value: 'balance', label: 'バランス', description: '総合的に判断' },
] as const;

// サポート必要度選択肢
export const SUPPORT_NEED_OPTIONS = [
  { value: 'shop_required', label: '店舗サポート必須', description: '対面で説明してほしい' },
  { value: 'shop_preferred', label: 'あると安心', description: '困ったときに行きたい' },
  { value: 'online_ok', label: 'オンラインでOK', description: '自分で調べられる' },
] as const;
