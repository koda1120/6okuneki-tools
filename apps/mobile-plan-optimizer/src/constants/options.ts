// 診断ウィザードで使用する選択肢の定義

// 続柄選択肢
export const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: '配偶者' },
  { value: 'child', label: '子供' },
  { value: 'parent', label: '親' },
  { value: 'grandparent', label: '祖父母' },
  { value: 'sibling', label: '兄弟姉妹' },
  { value: 'partner', label: '同性パートナー・事実婚' },
  { value: 'other_relative', label: 'その他の親族' },
  { value: 'roommate', label: '同居人（親族ではない）' },
] as const;

// データ使用量選択肢
export const DATA_USAGE_OPTIONS = [
  { value: 'under_1gb', label: '1GB未満', description: 'ほとんどWi-Fiのみ' },
  { value: '1_3gb', label: '1〜3GB', description: 'LINEやメール中心' },
  { value: '3_10gb', label: '3〜10GB', description: 'SNSや軽い動画視聴' },
  { value: '10_20gb', label: '10〜20GB', description: '動画視聴が多め' },
  { value: '20_50gb', label: '20〜50GB', description: 'かなり使う' },
  { value: 'over_50gb', label: '50GB以上', description: 'ヘビーユーザー' },
  { value: 'unlimited', label: '無制限がいい', description: '容量を気にしたくない' },
  { value: 'unknown', label: 'わからない', description: '後で推定します' },
] as const;

// 通話時間選択肢
export const CALL_DURATION_OPTIONS = [
  { value: 'under_1min', label: '1分未満', description: '短い用件のみ' },
  { value: '1_5min', label: '1〜5分', description: '普通の通話' },
  { value: '5_10min', label: '5〜10分', description: 'やや長め' },
  { value: 'over_10min', label: '10分以上', description: '長電話が多い' },
  { value: 'unknown', label: 'わからない', description: '' },
] as const;

// 通話頻度選択肢
export const CALL_FREQUENCY_OPTIONS = [
  { value: 'rarely', label: 'ほぼしない', description: '月2〜3回以下' },
  { value: 'sometimes', label: 'たまに', description: '週1〜2回' },
  { value: 'often', label: 'よくする', description: '週3回以上' },
  { value: 'daily', label: '毎日', description: '' },
  { value: 'unknown', label: 'わからない', description: '' },
] as const;

// 現在のキャリア選択肢
export const CURRENT_CARRIER_OPTIONS = [
  { value: 'docomo', label: 'ドコモ' },
  { value: 'au', label: 'au' },
  { value: 'softbank', label: 'ソフトバンク' },
  { value: 'rakuten', label: '楽天モバイル' },
  { value: 'mvno', label: '格安SIM（MVNO）' },
  { value: 'none', label: '契約なし' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 重視ポイント選択肢
export const PRIORITY_OPTIONS = [
  { value: 'price', label: '料金の安さ', description: 'とにかく安く' },
  { value: 'quality', label: '通信速度・品質', description: '快適さ重視' },
  { value: 'support', label: 'サポート体制', description: '困った時に頼りたい' },
  { value: 'data', label: 'データ量', description: '容量重視' },
  { value: 'points', label: '特典・ポイント', description: 'お得なキャンペーン' },
] as const;

// サポート必要度選択肢
export const SUPPORT_NEED_OPTIONS = [
  { value: 'shop_required', label: '店舗で対面サポート必須', description: '直接説明してほしい' },
  { value: 'shop_preferred', label: '店舗があると安心', description: 'あれば利用したい' },
  { value: 'phone_ok', label: '電話サポートでOK', description: '電話で解決できれば十分' },
  { value: 'chat_ok', label: 'チャット・Webで十分', description: '自分で調べられる' },
  { value: 'none', label: 'サポート不要', description: '問題なく使える' },
] as const;

// 光回線選択肢
export const HOME_INTERNET_OPTIONS = [
  { value: 'docomo_hikari', label: 'ドコモ光' },
  { value: 'au_hikari', label: 'auひかり' },
  { value: 'softbank_hikari', label: 'ソフトバンク光' },
  { value: 'rakuten_hikari', label: '楽天ひかり' },
  { value: 'nuro', label: 'NURO光' },
  { value: 'other', label: 'その他の光回線' },
  { value: 'none', label: '光回線なし' },
  { value: 'unknown', label: 'わからない' },
] as const;

// クレジットカード選択肢
export const CREDIT_CARD_OPTIONS = [
  { value: 'd_card', label: 'dカード' },
  { value: 'au_pay', label: 'au PAYカード' },
  { value: 'paypay', label: 'PayPayカード' },
  { value: 'rakuten', label: '楽天カード' },
  { value: 'other', label: 'その他' },
  { value: 'none', label: 'なし/使わない' },
] as const;

// Wi-Fi有無選択肢
export const WIFI_OPTIONS = [
  { value: 'yes', label: '自宅にWi-Fiあり' },
  { value: 'no', label: '自宅にWi-Fiなし' },
  { value: 'unused', label: 'Wi-Fiあるが使っていない' },
] as const;

// Wi-Fi接続頻度選択肢
export const WIFI_CONNECTION_OPTIONS = [
  { value: 'always', label: '常に接続' },
  { value: 'mostly', label: 'ほぼ接続' },
  { value: 'rarely', label: 'あまり接続しない' },
  { value: 'never', label: '接続しない' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 主な利用場所選択肢
export const MAIN_USAGE_LOCATION_OPTIONS = [
  { value: 'home', label: '主に自宅', description: '在宅が多い' },
  { value: 'half', label: '半々くらい', description: '' },
  { value: 'outside', label: '主に外出先', description: '外出が多い' },
  { value: 'unknown', label: 'わからない', description: '' },
] as const;

// 自宅での利用用途選択肢
export const HOME_ACTIVITIES_OPTIONS = [
  { value: 'video', label: '動画視聴（YouTube, Netflix等）' },
  { value: 'sns', label: 'SNS（X, Instagram等）' },
  { value: 'game', label: 'ゲーム' },
  { value: 'browse', label: 'Web閲覧・検索' },
  { value: 'rarely', label: 'ほとんど使わない' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 外出先での利用用途選択肢
export const OUTSIDE_ACTIVITIES_OPTIONS = [
  { value: 'sns', label: 'SNS' },
  { value: 'video', label: '動画視聴' },
  { value: 'music', label: '音楽ストリーミング' },
  { value: 'game', label: 'ゲーム' },
  { value: 'work', label: '仕事（メール、ビデオ会議等）' },
  { value: 'rarely', label: 'ほとんど使わない' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 通話相手選択肢
export const CALL_TARGET_OPTIONS = [
  { value: 'family', label: '家族' },
  { value: 'work', label: '仕事関係' },
  { value: 'friends', label: '友人' },
  { value: 'landline', label: '固定電話（病院、店舗等）' },
  { value: 'unknown', label: 'わからない' },
] as const;

// LINE通話可否選択肢
export const LINE_CALL_OPTIONS = [
  { value: 'yes', label: 'LINE通話で代替OK' },
  { value: 'no', label: '電話番号での通話が必要' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 月額料金選択肢
export const MONTHLY_FEE_OPTIONS = [
  { value: '', label: 'わからない' },
  { value: '0-1000', label: '1,000円以下' },
  { value: '1000-2000', label: '1,000〜2,000円' },
  { value: '2000-3000', label: '2,000〜3,000円' },
  { value: '3000-5000', label: '3,000〜5,000円' },
  { value: '5000-7000', label: '5,000〜7,000円' },
  { value: '7000-10000', label: '7,000〜10,000円' },
  { value: '10000+', label: '10,000円以上' },
] as const;

// 海外利用頻度選択肢
export const OVERSEAS_USAGE_OPTIONS = [
  { value: 'often', label: 'よく使う（年3回以上）' },
  { value: 'sometimes', label: 'たまに使う（年1〜2回）' },
  { value: 'rarely', label: 'ほとんど使わない' },
] as const;

// テザリング利用頻度選択肢
export const TETHERING_USAGE_OPTIONS = [
  { value: 'often', label: 'よく使う' },
  { value: 'sometimes', label: 'たまに使う' },
  { value: 'never', label: '使わない' },
] as const;

// 家族キャリア希望選択肢
export const FAMILY_CARRIER_PREFERENCE_OPTIONS = [
  { value: 'same', label: '家族で同じキャリアがいい', description: '家族割を活用' },
  { value: 'separate', label: '別々でもOK', description: '各自最適なプランを' },
  { value: 'both', label: 'どちらでも', description: '比較して決めたい' },
] as const;

// 乗り換えの不安選択肢
export const CONCERNS_OPTIONS = [
  { value: 'sim_setup', label: 'SIMカードの設定' },
  { value: 'data_transfer', label: 'データ移行' },
  { value: 'contacts', label: '連絡先の移行' },
  { value: 'mnp', label: 'MNP手続き' },
  { value: 'none', label: '特になし' },
] as const;

// 端末タイプ選択肢
export const DEVICE_TYPE_OPTIONS = [
  { value: 'iphone', label: 'iPhone' },
  { value: 'android', label: 'Android' },
  { value: 'other', label: 'その他/わからない' },
] as const;

// 端末購入予定選択肢
export const DEVICE_PURCHASE_OPTIONS = [
  { value: 'keep', label: '今の端末を使い続ける' },
  { value: 'new', label: '新しい端末を購入予定' },
] as const;

// 5G対応端末選択肢
export const HAS_5G_DEVICE_OPTIONS = [
  { value: 'yes', label: '5G対応' },
  { value: 'no', label: '5G非対応' },
  { value: 'unknown', label: 'わからない' },
] as const;

// 苗字選択肢
export const SAME_FAMILY_NAME_OPTIONS = [
  { value: 'same', label: '同じ苗字' },
  { value: 'different', label: '異なる苗字' },
  { value: 'unknown', label: 'わからない' },
] as const;
