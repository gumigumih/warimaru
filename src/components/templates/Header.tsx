import warimaruSvg from "../../assets/warimaru-logo-white.svg";

export const Header = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <img src={warimaruSvg} alt="わりまる" className="w-40 drop-shadow-xl" />
      </div>
      <div className="glass-card p-5 text-center mb-8 text-shadow-2xl">
        <p className="text-sm text-slate-700">みんなが納得する、フェアな割り勘を最短で。</p>
        <p className="mt-2 text-lg font-semibold text-[#0f1f3a]">支払い入力 → 自動計算 → 高品質な共有画像を保存</p>
      </div>
    </>
  );
};
