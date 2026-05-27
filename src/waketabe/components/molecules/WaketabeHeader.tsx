import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../../components/templates/BrandHeader";

export const WaketabeHeader = () => {
  return (
    <BrandHeader
      icon={faUtensils}
      tag="waketabe"
      title="食べた分だけ、気持ちよく割る"
      subtitle="料理ごとに食べた人を選ぶだけで自動計算"
      accent="bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500"
    />
  );
};
