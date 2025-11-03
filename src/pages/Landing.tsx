import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center text-white">
        <h1 className="text-2xl font-extrabold tracking-wide text-shadow-md">わりまる & わけたべ</h1>
        <p className="mt-2 text-white/90 text-sm">割り勘を、もっとシンプルに。</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">わりまる</h2>
              <p className="text-sm text-gray-600">飲み会や旅行の総額をスマートに割り勘</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/warimaru')}>使ってみる</button>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">わけたべ</h2>
              <p className="text-sm text-gray-600">外食で“食べた分だけ”をかんたん割り勘</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/waketabe/participants')}>使ってみる</button>
          </div>
        </div>
      </div>
    </div>
  );
};
