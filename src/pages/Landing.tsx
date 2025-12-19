import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'わりまる',
      description: '飲み会や旅行の「総額」を美しく分ける。人数無制限で、結果を画像保存。',
      cta: '使ってみる',
      to: '/warimaru',
      badge: '総額割り勘',
      accent: 'from-blue-500 via-sky-400 to-cyan-300',
    },
    {
      title: 'わけたべ',
      description: '食べた分だけをスマート分配。料理ごとに食べた人を選ぶだけで自動計算。',
      cta: '使ってみる',
      to: '/waketabe/participants',
      badge: '食べた分だけ',
      accent: 'from-emerald-400 via-teal-400 to-cyan-400',
    },
  ];

  return (
    <div className="space-y-8 text-[#0f1f3a]">
      <div className="glass-card p-6 sm:p-8 shadow-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
          割り勘を、もう迷わない
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-shadow-md text-[#0f1f3a]">
          わりまる
        </h1>
        <p className="mt-3 text-slate-700 text-base leading-relaxed">
          飲み会や旅行の支払いを、シンプルにフェアに。
          わりまるなら、総額入力だけで最適な割り勘をすぐ共有できます。
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1">🧮 自動計算</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1">💾 画像保存</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1">📱 レスポンシブ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(action => (
          <div
            key={action.title}
            className="glass-card p-5 sm:p-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br blur-3xl pointer-events-none" />
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-50" />
            <div className="relative space-y-3">
              <div className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                {action.badge}
              </div>
              <div className={`inline-flex w-12 h-1 rounded-full bg-gradient-to-r ${action.accent}`} />
              <h2 className="text-xl font-bold text-[#0f1f3a]">{action.title}</h2>
              <p className="text-sm text-slate-700 leading-relaxed">{action.description}</p>
              <button
                className={`btn ${action.title === 'わりまる' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => action.to.startsWith('http') ? window.open(action.to, '_blank') : navigate(action.to)}
              >
                {action.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
