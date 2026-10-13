import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCalculator,
  faRoute,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import warimaruLogo from '../assets/warimaru-logo-white.svg';
import warimaruBackground from '../assets/warimaru-background.png';

export const Landing = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      key: 'simple',
      title: '1人がまとめて払った会計を割る',
      description: '合計金額と人数を入力するだけで、1人あたりの金額を出します。',
      bestFor: '例：飲み会、ランチ、タクシー',
      cta: '計算する',
      to: '/simple',
      accent: 'from-slate-700 via-slate-600 to-slate-500',
      icon: faCalculator,
    },
    {
      key: 'equal-split',
      title: '複数人が立て替えた会計を精算する',
      description: '複数人が立て替えた金額をまとめて、誰が誰にいくら渡すかを出します。',
      bestFor: '例：旅行、イベント、共同購入',
      cta: '計算する',
      to: '/equal-split',
      accent: 'from-blue-500 via-sky-400 to-cyan-300',
      icon: faCalculator,
    },
    {
      key: 'meal-split',
      title: 'レストランで食べた分だけ割る',
      description: '料理名・金額・食べた人を入力して、一緒に食べた料理だけで割り勘します。',
      bestFor: '例：レストラン、大皿料理、飲み物',
      cta: '計算する',
      to: '/meal-split/participants',
      accent: 'from-orange-500 via-amber-500 to-yellow-500',
      icon: faUtensils,
    },
    {
      key: 'potluck-split',
      title: '持ち寄り飲み会を精算する',
      description: '酒代は飲む人だけ、料理代は全員で。費目ごとの参加者と、みんなの立替額をまとめて精算します。',
      bestFor: '例：お酒を飲まない人がいる飲み会、BBQ、旅行',
      cta: '計算する',
      to: '/potluck-split/participants',
      accent: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: faRoute,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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

    </div>
  );
};
