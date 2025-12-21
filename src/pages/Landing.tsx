import { useNavigate } from 'react-router-dom';
import warimaruLogo from '../assets/warimaru-logo-white.svg';
import waketabeLogo from '../assets/waketabe-logo-white.svg';

export const Landing = () => {
  const navigate = useNavigate();

  const actions = [
    {
      key: 'warimaru',
      title: '総額を等分して割る',
      description: '飲み会や旅行の「総額」を美しく分ける。人数無制限で、結果を画像保存。',
      cta: '使ってみる',
      to: '/warimaru',
      badge: '総額割り勘',
      accent: 'from-blue-500 via-sky-400 to-cyan-300',
      logo: warimaruLogo,
      logoAlt: 'わりまる',
    },
    {
      key: 'waketabe',
      title: '食べた分だけで割る',
      description: '食べた分だけをスマート分配。料理ごとに食べた人を選ぶだけで自動計算。',
      cta: '使ってみる',
      to: '/waketabe/participants',
      badge: '食べた分だけ',
      accent: 'from-orange-400 via-amber-400 to-amber-500',
      logo: waketabeLogo,
      logoAlt: 'わけたべ',
    },
  ];

  return (
    <div className="space-y-8 text-[#0f1f3a]">
      <div className="glass-card p-6 sm:p-8 shadow-lg bg-white/95 border border-slate-100">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          割り勘を、もう迷わない
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-[#0f1f3a]">
          パパっとワリカン
        </h1>
        <p className="mt-3 text-slate-700 text-base leading-relaxed">
          総額割りと食べた分割り、シーンに合わせてサクッと計算。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">🧮 自動計算</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">💾 画像保存</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">📱 レスポンシブ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(action => (
          <div
            key={action.title}
            className="glass-card p-5 sm:p-6 relative overflow-hidden bg-white/95 border border-slate-100 shadow-sm"
          >
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-white via-slate-50 to-white blur-3xl pointer-events-none" />
            <div className="relative space-y-3">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {action.badge}
                </div>
                <div className={`h-20 min-w-[72px] rounded-xl flex items-center justify-center shadow-md px-3 ${
                  action.key === 'warimaru'
                    ? 'bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300'
                    : 'bg-gradient-to-br from-orange-400 via-amber-400 to-amber-500'
                }`}>
                  <img
                    src={action.logo}
                    alt={action.logoAlt}
                    className="h-1/2 w-auto max-w-full object-contain"
                  />
                </div>

              </div>
              <h2 className="text-xl font-bold text-[#0f1f3a] sr-only">{action.title}</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{action.description}</p>
              <div className="flex justify-center">
                <button
                  className={`btn text-white border-none bg-gradient-to-r ${action.accent} hover:opacity-95`}
                  onClick={() => action.to.startsWith('http') ? window.open(action.to, '_blank') : navigate(action.to)}
                >
                  {action.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
