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

export const Landing = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      key: 'warimaru',
      title: '総額を等分して割る',
      description: '飲み会、イベント、ちょっとした立替を、総額と人数からすばやく精算します。',
      bestFor: '総額が決まっていて、全員で同じ金額を払うとき',
      cta: '計算する',
      to: '/warimaru',
      badge: '公開中',
      accent: 'from-blue-500 via-sky-400 to-cyan-300',
      icon: faCalculator,
    },
    {
      key: 'waketabe',
      title: '食べた分だけで割る',
      description: '料理ごとに食べた人を選ぶだけで、食べた分に合わせて金額を分けます。',
      bestFor: '大皿料理や飲み物など、食べた人が分かれる食事会',
      cta: '計算する',
      to: '/waketabe/participants',
      badge: '公開中',
      accent: 'from-orange-400 via-amber-400 to-amber-500',
      icon: faUtensils,
    },
  ];

  const plannedTools = [
    {
      title: '項目ごとに対象者を変えて割る',
      description: '宿は全員、レンタカーは乗った人だけ、チケットは購入者だけなど、費用ごとに割る相手が違う精算に使います。',
      input: '項目名・金額・立替者・対象者',
      output: '全項目を合算した精算ルート',
      badge: '旅行・イベント向け',
      icon: faRoute,
    },
    {
      title: '会計前に税込・割引込みで割る',
      description: '税抜価格、サービス料、クーポン、ポイント利用を反映して、支払い前に1人あたりの目安を出します。',
      input: '小計・税率・サービス料・割引',
      output: '最終会計額と1人あたり',
      badge: 'レストラン会計向け',
      icon: faReceipt,
    },
    {
      title: 'プレゼント代を集める',
      description: '誕生日、送別会、差し入れなど、購入費を払う人だけで分けて集金額を出します。',
      input: '購入金額・払う人',
      output: '1人あたりと集金額',
      badge: 'ギフト向け',
      icon: faGift,
    },
    {
      title: '時間や参加範囲で割る',
      description: '途中参加、二次会だけ参加、飲み放題だけ対象外など、参加範囲が違う会の精算に使います。',
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

  const calculationPolicies = [
    'まず総額を項目に分ける',
    '項目ごとに払う人と対象者を決める',
    '対象者ごとの係数で負担額を出す',
    '立替額との差分から精算ルートを作る',
    '最後に端数処理を選ぶ',
  ];

  return (
    <div className="space-y-8 text-[#0f1f3a]">
      <header className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white/95 px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-32 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300 px-3 shadow-sm">
            <img
              src={warimaruLogo}
              alt="わりまる"
              className="max-h-8 w-auto max-w-full object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-extrabold leading-none text-slate-950">わりまる</p>
            <p className="mt-1 text-xs font-semibold text-slate-600">割り勘・精算ツール</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-600 sm:w-[360px]">
          <div className="rounded-md bg-slate-50 px-3 py-2">端末内計算</div>
          <div className="rounded-md bg-slate-50 px-3 py-2">画像保存</div>
          <div className="rounded-md bg-slate-50 px-3 py-2">スマホ対応</div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-4">
          <div className="inline-flex rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            計算機を選んで、すぐ精算
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
            割り勘を、すぐ計算
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
            飲み会、旅行、イベント、食事会の精算に使える計算機をまとめました。必要なものを選んで、入力はできるだけ少なく、結果はそのまま共有できます。
          </p>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-white text-center shadow-sm">
          <div className="border-r border-slate-200 px-3 py-4">
            <p className="text-2xl font-extrabold text-slate-950">2</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">公開中</p>
          </div>
          <div className="border-r border-slate-200 px-3 py-4">
            <p className="text-2xl font-extrabold text-slate-950">4</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">ツール候補</p>
          </div>
          <div className="px-3 py-4">
            <p className="text-2xl font-extrabold text-slate-950">0</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">サーバー保存</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">すぐ使える計算機</h2>
            <p className="mt-1 text-sm text-slate-600">よくある割り勘なら、ここからそのまま計算できます。</p>
          </div>
          <p className="text-xs font-semibold text-slate-500">公開中のツール</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calculators.map(action => (
            <div
              key={action.title}
              className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className={`h-20 bg-gradient-to-r ${action.accent} p-4`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-md bg-white/20 px-2 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                    <FontAwesomeIcon icon={action.icon} className="h-3 w-3" />
                    {action.badge}
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/20 text-white ring-1 ring-white/20">
                    <FontAwesomeIcon icon={action.icon} className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">{action.title}</h3>
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

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-lg font-bold text-slate-950">計算の基本方針</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              複雑な割り勘でも、内部では「誰が払ったか」「誰が対象か」「どの比率で負担するか」に分けて扱います。最後に送金回数が少なくなるように精算ルートをまとめます。
            </p>
          </div>
          <div className="grid w-full gap-2 lg:max-w-md">
            {calculationPolicies.map((policy, index) => (
              <div key={policy} className="flex items-center gap-3 rounded-md bg-slate-50 px-3 py-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700">{policy}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
