import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../components/templates/BrandHeader";

export const Header = () => {
  return (
    <BrandHeader
      icon={faCalculator}
      tag="warimaru"
      title="総額割り勘をすぐに"
      subtitle="人数はそのまま、計算結果は画像でシェア"
      accent="bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
    />
  );
};
