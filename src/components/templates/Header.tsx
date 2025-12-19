import warimaruSvg from "../../assets/warimaru-logo-white.svg";
import { BrandHeader } from "./BrandHeader";

export const Header = () => {
  return (
    <BrandHeader
      logoSrc={warimaruSvg}
      alt="わりまる"
      tag="warimaru"
      title="総額をフェアに、シンプルに"
      subtitle="人数無制限・画像保存で迷わず割り勘"
      accent="bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
    />
  );
};
