import warimaruSvg from "../../assets/warimaru-logo-white.svg";
import { BrandHeader } from "./BrandHeader";

export const Header = () => {
  return (
    <BrandHeader
      logoSrc={warimaruSvg}
      alt="わりまる"
      tag="warimaru"
      title="総額割り勘をすぐに"
      subtitle="人数はそのまま、計算結果は画像でシェア"
      accent="bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
    />
  );
};
