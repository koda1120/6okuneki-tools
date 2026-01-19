import { useState } from 'react';
import { X, ChevronDown, ChevronUp, CreditCard, HelpCircle, Monitor, FileText, AlertCircle } from 'lucide-react';

interface CardGuide {
  id: string;
  name: string;
  color: string;
  steps: string[];
  note?: string;
}

const cardGuides: CardGuide[] = [
  {
    id: 'rakuten',
    name: '楽天カード',
    color: '#BF0000',
    steps: [
      '楽天e-NAVIにログイン',
      '「ご利用明細」をクリック',
      '「CSV形式でダウンロード」を選択',
    ],
  },
  {
    id: 'smbc',
    name: '三井住友カード',
    color: '#00A650',
    steps: [
      'Vpassにログイン',
      '「ご利用明細」をクリック',
      '「CSV出力」ボタンをクリック',
    ],
  },
  {
    id: 'jcb',
    name: 'JCBカード',
    color: '#0066B3',
    steps: [
      'MyJCBにログイン',
      '「カードご利用明細照会」を選択',
      '「CSVダウンロード」をクリック',
    ],
  },
  {
    id: 'aeon',
    name: 'イオンカード',
    color: '#9B0E7D',
    steps: [
      '暮らしのマネーサイトにログイン',
      '「ご利用明細」をクリック',
      '「CSV形式で保存」を選択',
    ],
  },
  {
    id: 'dcard',
    name: 'dカード',
    color: '#C00000',
    steps: [
      'dカードサイトにログイン',
      '「ご利用明細確認」をクリック',
      '「CSV出力」を選択',
    ],
  },
  {
    id: 'aupay',
    name: 'au PAY カード',
    color: '#FF5722',
    steps: [
      'au PAY カードサイトにログイン',
      '「WEB明細」をクリック',
      '「CSVダウンロード」を選択',
    ],
  },
  {
    id: 'paypay',
    name: 'PayPayカード',
    color: '#FF0033',
    steps: [
      'PayPayカード会員メニューにログイン',
      '「ご利用明細」をクリック',
      '「CSV形式でダウンロード」を選択',
    ],
  },
  {
    id: 'epos',
    name: 'エポスカード',
    color: '#E60012',
    steps: [
      'エポスNetにログイン',
      '「ご利用明細」をクリック',
      '「CSV出力」を選択',
    ],
  },
  {
    id: 'saison',
    name: 'セゾンカード',
    color: '#003399',
    steps: [
      'Netアンサーにログイン',
      '「ご利用明細確認」をクリック',
      '「CSVダウンロード」を選択',
    ],
  },
  {
    id: 'orico',
    name: 'オリコカード',
    color: '#003D7C',
    steps: [
      'eオリコサービスにログイン',
      '「ご利用明細」をクリック',
      '「CSV出力」を選択',
    ],
  },
  {
    id: 'mufg',
    name: '三菱UFJニコス',
    color: '#DA291C',
    steps: [
      'MUFGカードWEBサービスにログイン',
      '「ご利用明細照会」をクリック',
      '「CSV形式でダウンロード」を選択',
    ],
  },
  {
    id: 'amex',
    name: 'アメリカン・エキスプレス',
    color: '#006FCF',
    steps: [
      'アメックスオンラインにログイン',
      '「ご利用明細」→「明細書のダウンロード」',
      '「CSV」形式を選択してダウンロード',
    ],
  },
];

interface CsvDownloadGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CsvDownloadGuide({ isOpen, onClose }: CsvDownloadGuideProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-bg-card rounded-softer shadow-warm-lg w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-light rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-text-main">
              CSVダウンロード方法
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-base rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-text-sub" />
          </button>
        </div>

        {/* 注意事項 */}
        <div className="p-4 bg-accent-light/50 border-b border-border">
          <div className="space-y-2 text-sm text-text-sub">
            <div className="flex items-start gap-2">
              <Monitor className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>PCからのアクセス推奨（スマホアプリ非対応の場合あり）</span>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>CSVが見つからない場合はPDFでもOK</span>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>文字化けする場合は「Shift-JIS」形式を選択</span>
            </div>
          </div>
        </div>

        {/* カード一覧 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {cardGuides.map((card) => (
              <div
                key={card.id}
                className="border border-border rounded-soft overflow-hidden"
              >
                {/* カード名ボタン */}
                <button
                  onClick={() => toggleCard(card.id)}
                  className="w-full flex items-center justify-between p-3 hover:bg-bg-base transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: card.color + '15' }}
                    >
                      <CreditCard
                        className="w-4 h-4"
                        style={{ color: card.color }}
                      />
                    </div>
                    <span className="font-medium text-text-main">{card.name}</span>
                  </div>
                  {expandedCard === card.id ? (
                    <ChevronUp className="w-5 h-5 text-text-sub" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-sub" />
                  )}
                </button>

                {/* 手順（展開時） */}
                {expandedCard === card.id && (
                  <div className="px-4 pb-4 pt-1 bg-bg-base">
                    <ol className="space-y-2">
                      {card.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: card.color }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-sm text-text-main pt-0.5">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                    {card.note && (
                      <p className="mt-3 text-xs text-text-sub bg-bg-card p-2 rounded">
                        {card.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t border-border bg-bg-base">
          <p className="text-xs text-text-sub text-center">
            お使いのカード会社が見つからない場合は、<br />
            会員サイトで「CSV」「明細ダウンロード」などで検索してください
          </p>
        </div>
      </div>
    </div>
  );
}
