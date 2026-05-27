import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalculator,
  faClock,
  faCoins,
  faGift,
  faPercent,
  faReceipt,
  faRoute,
  faSliders,
  faUtensils,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import warimaruLogo from '../assets/warimaru-logo-white.svg';
import warimaruBackground from '../assets/warimaru-background.png';

export const Landing = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      key: 'simple',
      title: 'シンプルに割る',
      description: '合計金額を人数で割って、1人あたりいくらかだけをすぐ出します。',
      bestFor: '払った人が1人で、1人あたりの目安だけ知りたいとき',
      cta: '計算する',
      to: '/simple',
      accent: 'from-slate-700 via-slate-600 to-slate-500',
      icon: faCalculator,
    },
    {
      key: 'equal-split',
      title: '総額を等分して割る',
      description: '複数人が払った金額をまとめて、誰が誰にいくら渡すかを出します。',
      bestFor: '払った人が複数いて、最後にきれいに精算したいとき',
      cta: '計算する',
      to: '/equal-split',
      accent: 'from-blue-500 via-sky-400 to-cyan-300',
      icon: faCalculator,
    },
    {
      key: 'meal-split',
      title: '食べた分だけで割る',
      description: '料理ごとに食べた人を選んで、食べた分だけの負担額を出します。',
      bestFor: '大皿料理や飲み物で、頼んだものが人によって違うとき',
      cta: '計算する',
      to: '/meal-split/participants',
      accent: 'from-orange-500 via-amber-500 to-yellow-500',
      icon: faUtensils,
    },
  ];

  const plannedTools = [
    {
      title: '項目ごとに対象者を変えて割る',
      description: '宿代は全員、レンタカーは乗った人だけ、チケットは買った人だけ、のように項目ごとに分けます。',
      input: '項目名・金額・立替者・対象者',
      output: '全項目を合算した精算ルート',
      badge: '旅行・イベント向け',
      icon: faRoute,
    },
    {
      title: '会計前に税込・割引込みで割る',
      description: '税・サービス料・クーポンまで入れて、レジに行く前に1人あたりを確認します。',
      input: '小計・税率・サービス料・割引',
      output: '最終会計額と1人あたり',
      badge: 'レストラン会計向け',
      icon: faReceipt,
    },
    {
      title: 'プレゼント代を集める',
      description: '誕生日や送別会のプレゼント代を、参加する人だけで分けて集める金額を出します。',
      input: '購入金額・払う人',
      output: '1人あたりと集金額',
      badge: 'ギフト向け',
      icon: faGift,
    },
    {
      title: '時間や参加範囲で割る',
      description: '途中参加、二次会だけ参加、飲み放題なしなど、参加した範囲に合わせて分けます。',
      input: '項目・参加範囲・対象者',
      output: '参加範囲ごとの負担額',
      badge: '途中参加向け',
      icon: faClock,
    },
  ];

  const calculationOptions = [
    {
      title: '上司・先輩が多めに払う',
      method: '人ごとに係数を持たせて、総額を係数の合計で割ります。2口、1口、0.5口のような入力です。',
      badge: '傾斜割り',
      icon: faSliders,
    },
    {
      title: '会計をきれいな金額に丸める',
      method: '1人あたりを100円単位、500円単位などに丸め、差額を幹事・立替者・全員で再配分から選べるようにします。',
      badge: '端数調整',
      icon: faCoins,
    },
    {
      title: '飲む人・飲まない人で差をつける',
      method: '料理代は全員、飲み物代は飲む人だけ、または飲む人を高い係数にする方式を選べるようにします。',
      badge: '対象者・係数',
      icon: faUsers,
    },
    {
      title: '名前は残して対象から外す',
      method: '単純に払わない人は入力しません。結果共有に名前だけ残したい場合や、特定の項目だけ対象外にしたい場合に使います。',
      badge: '表示・対象者',
      icon: faGift,
    },
    {
      title: '子ども・学生・家族で負担を変える',
      method: '大人1、子ども0.5、未就学児0のようにテンプレート化し、人数が多くても迷わず計算します。',
      badge: '負担率テンプレ',
      icon: faPercent,
    },
  ];

  return (
    <div className="space-y-8 text-[#0f1f3a]">
      <section
        className="relative overflow-hidden rounded-lg bg-sky-500 px-5 py-6 text-white shadow-lg sm:px-8 sm:py-8 lg:px-10 lg:py-10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.45), rgba(14, 165, 233, 0.22)), url(${warimaruBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative space-y-7">
          <div className="border-b border-white/20 pb-5">
            <div className="flex items-center">
              <img
                src={warimaruLogo}
                alt="わりまる"
                className="h-11 w-auto max-w-[190px] object-contain sm:h-12 sm:max-w-[220px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="space-y-3">
                <p className="text-sm font-bold text-white/85">
                  割り勘・精算ツール
                </p>
                <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                  割り勘を、すぐ計算
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                  飲み会、旅行、イベント、食事会の精算に使える計算機をまとめました。必要なものを選んで、入力はできるだけ少なく、結果はそのまま共有できます。
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:w-[360px]">
              <div className="rounded-md bg-white/15 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                <p className="text-sm font-extrabold text-white">計算機を選ぶ</p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">目的に合う割り方から始められます</p>
              </div>
              <div className="rounded-md bg-white/15 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                <p className="text-sm font-extrabold text-white">画像で共有</p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">画像保存でそのまま共有できます</p>
              </div>
              <div className="rounded-md bg-white/15 px-4 py-3 ring-1 ring-white/20 backdrop-blur">
                <p className="text-sm font-extrabold text-white">端末内で完結</p>
                <p className="mt-1 text-xs leading-relaxed text-white/80">入力内容はサーバーに保存しません</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">すぐ使える計算機</h2>
            <p className="mt-1 text-sm text-slate-600">よくある割り勘なら、ここからそのまま計算できます。</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculators.map(action => (
            <div
              key={action.title}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className={`h-2 bg-gradient-to-r ${action.accent}`} />
              <div className="space-y-4 p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-r ${action.accent} text-white shadow-sm`}>
                      <FontAwesomeIcon icon={action.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">{action.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{action.description}</p>
                </div>
                <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
                  {action.bestFor}
                </div>
                <button
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r ${action.accent} px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-95`}
                  onClick={() => navigate(action.to)}
                >
                  {action.cta}
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">追加したいツール</h2>
            <p className="mt-1 text-sm text-slate-600">入力の考え方が違うものは、独立した計算機として分ける想定です。</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">ツール計画</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {plannedTools.map(tool => (
            <div
              key={tool.title}
              className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                  <FontAwesomeIcon icon={tool.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-950">{tool.title}</h3>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                  <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                    <div className="rounded-md bg-slate-50 px-3 py-2">
                      <span className="font-bold text-slate-700">入力: </span>
                      {tool.input}
                    </div>
                    <div className="rounded-md bg-slate-50 px-3 py-2">
                      <span className="font-bold text-slate-700">結果: </span>
                      {tool.output}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">計算オプション</h2>
            <p className="mt-1 text-sm text-slate-600">係数や端数処理は、別ツールではなく各計算機の中で選べる設定にします。</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">割り方の設定</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {calculationOptions.map(option => (
            <div key={option.title} className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                  <FontAwesomeIcon icon={option.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-950">{option.title}</h3>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {option.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{option.method}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
