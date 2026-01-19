import { Crown, AlertTriangle, Check, ExternalLink, Wifi, Phone } from 'lucide-react';
import type { PlanScore } from '../../types/result';

interface PlanCardProps {
  planScore: PlanScore;
  rank: number;
  isTop: boolean;
}

export function PlanCard({ planScore, rank, isTop }: PlanCardProps) {
  const { plan, totalScore, monthlyPrice, appliedDiscounts, warnings } = planScore;

  const formatPrice = (price: number) => price.toLocaleString();

  // キャリア名のマッピング
  const carrierNames: Record<string, string> = {
    linemo: 'LINEMO',
    ahamo: 'ahamo',
    povo: 'povo',
    ymobile: 'Y!mobile',
    uqmobile: 'UQモバイル',
    rakuten: '楽天モバイル',
    iijmio: 'IIJmio',
    mineo: 'mineo',
    nuro_mobile: 'NUROモバイル',
    ocn_mobile: 'OCNモバイルONE',
    biglobe: 'BIGLOBEモバイル',
    docomo: 'ドコモ',
    au: 'au',
    softbank: 'ソフトバンク',
    nihontsushin: '日本通信SIM',
    aeon: 'イオンモバイル',
    his: 'HISモバイル',
    libmo: 'LIBMO',
    linksmate: 'LinksMate',
    jcom: 'J:COM MOBILE',
    yu_mobile: 'y.u mobile',
    qtmobile: 'QTモバイル',
  };

  const carrierName = carrierNames[plan.carrierId] || plan.carrierId;

  const networkNames: Record<string, string> = {
    docomo: 'docomo',
    au: 'au',
    softbank: 'SoftBank',
    rakuten: '楽天',
  };

  // キャリア公式サイトURL
  const carrierUrls: Record<string, string> = {
    linemo: 'https://www.linemo.jp/',
    ahamo: 'https://ahamo.com/',
    povo: 'https://povo.jp/',
    ymobile: 'https://www.ymobile.jp/',
    uqmobile: 'https://www.uqwimax.jp/mobile/',
    rakuten: 'https://network.mobile.rakuten.co.jp/',
    iijmio: 'https://www.iijmio.jp/',
    mineo: 'https://mineo.jp/',
    nuro_mobile: 'https://mobile.nuro.jp/',
    ocn_mobile: 'https://www.ntt.com/personal/services/mobile/one.html',
    biglobe: 'https://join.biglobe.ne.jp/mobile/',
    docomo: 'https://www.docomo.ne.jp/',
    au: 'https://www.au.com/',
    softbank: 'https://www.softbank.jp/',
    nihontsushin: 'https://www.nihontsushin.com/',
    aeon: 'https://aeonmobile.jp/',
    his: 'https://his-mobile.com/',
    libmo: 'https://www.libmo.jp/',
    linksmate: 'https://linksmate.jp/',
    jcom: 'https://www.jcom.co.jp/service/mobile/',
    yu_mobile: 'https://www.yumobile.jp/',
    qtmobile: 'https://www.qtmobile.jp/',
    nifmo: 'https://nifmo.nifty.com/',
    rocket_mobile: 'https://rokemoba.com/',
    yamada_newmobile: 'https://www.yamada-denki.jp/service/mobile/',
    hi_ho: 'https://hi-ho.jp/course/hihomobile/lte/',
    asahi_net: 'https://asahi-net.jp/service/mobile/sim/',
    wirelessgate: 'https://www.wirelessgate.co.jp/sim/',
    pikara_mobile: 'https://www.pikara.jp/mobile/',
    eo_mobile: 'https://eonet.jp/mobile/',
    tokai_mobile: 'https://www.libmo.jp/',
    bic_sim: 'https://www.iijmio.jp/bicsim/',
    sumamoba: 'https://smamoba.jp/',
    fiimo: 'https://www.fiimo.jp/',
    x_mobile: 'https://www.xmobile.ne.jp/',
    interlink: 'https://www.interlink.or.jp/service/sim/',
    tikimo: 'https://tikimo.net/',
    penguin_mobile: 'https://penguin-mobile.com/',
    bbiq: 'https://www.bbiq.jp/mobile/',
    commufa: 'https://www.commufa.jp/mobile/',
    repair_sim: 'https://www.repair-sim.jp/',
    at_mobilekun: 'https://www.mobile-kun.jp/',
    wonderlink: 'https://www.wonderlink.jp/',
    g_call: 'https://www.g-call.com/sim/',
    so_net: 'https://www.so-net.ne.jp/access/mobile/',
  };

  const carrierUrl = carrierUrls[plan.carrierId];

  return (
    <div
      className={`card relative ${
        isTop ? 'border-2 border-accent' : ''
      }`}
    >
      {/* トップバッジ */}
      {isTop && (
        <div className="absolute -top-3 left-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Crown className="w-3 h-3" />
          おすすめ
        </div>
      )}

      <div className={isTop ? 'pt-2' : ''}>
        {/* ヘッダー: キャリア・プラン名 */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-white bg-text-sub px-2 py-0.5 rounded">
                {rank}位
              </span>
              <span className="text-xs text-text-sub">
                {networkNames[plan.networkType]}回線
              </span>
            </div>
            <p className="text-sm font-medium text-text-sub">{carrierName}</p>
            <h4 className="font-bold text-lg text-text-main">
              {plan.name}
            </h4>
          </div>
        </div>

        {/* 料金 - 大きく表示 */}
        <div className="bg-bg-base rounded-lg p-4 mb-4">
          <p className="price-large text-text-main text-center">
            ¥{formatPrice(monthlyPrice)}
            <span className="price-unit text-text-sub">/月</span>
          </p>
        </div>

        {/* スペック一覧 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-text-sub" />
            <div>
              <p className="text-xs text-text-sub">データ容量</p>
              <p className="text-sm font-semibold text-text-main">
                {plan.dataCapacityGb === null
                  ? '無制限'
                  : `${plan.dataCapacityGb}GB`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-text-sub" />
            <div>
              <p className="text-xs text-text-sub">通話</p>
              <p className="text-sm font-semibold text-text-main">
                {plan.voiceFreeMinutes > 0
                  ? `${plan.voiceFreeMinutes}分無料`
                  : '従量制'}
              </p>
            </div>
          </div>
        </div>

        {/* マッチ度バー */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-text-sub mb-1">
            <span>マッチ度</span>
            <span className="font-semibold text-accent">{totalScore}点</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${totalScore}%` }}
            />
          </div>
        </div>

        {/* 特徴タグ */}
        {plan.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {plan.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-text-main px-2 py-1 rounded"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* 適用割引 */}
        {appliedDiscounts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {appliedDiscounts.map((discount, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded"
              >
                <Check className="w-3 h-3" />
                {discount.name} -{discount.amount.toLocaleString()}円
              </span>
            ))}
          </div>
        )}

        {/* 警告 */}
        {warnings.length > 0 && (
          <div className="mb-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
            {warnings.map((warning, index) => (
              <p
                key={index}
                className="flex items-start gap-2 text-xs text-warning"
              >
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* 公式サイトリンク */}
        {carrierUrl ? (
          <a
            href={carrierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 rounded-lg border border-border text-text-main font-medium text-sm flex items-center justify-center gap-1.5 tap-target focus-ring hover:bg-gray-50 transition-colors"
          >
            公式サイトで詳細を見る
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <button
            disabled
            className="w-full h-10 rounded-lg border border-border text-text-sub font-medium text-sm flex items-center justify-center gap-1.5 cursor-not-allowed"
          >
            公式サイト情報なし
          </button>
        )}
      </div>
    </div>
  );
}
