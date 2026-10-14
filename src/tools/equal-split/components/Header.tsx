import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../../shared/components";

export const Header = () => {
  return (
    <BrandHeader
      icon={faCalculator}
      tag="立て替え精算"
      title="複数人が立て替えた会計を精算する"
      subtitle="誰がいくら払ったかを入力して、受け渡しを計算"
      accent="bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300"
    />
  );
};
