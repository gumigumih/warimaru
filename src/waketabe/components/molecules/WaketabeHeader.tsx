import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../../components/templates/BrandHeader";

export const MealSplitHeader = () => {
  return (
    <BrandHeader
      icon={faUtensils}
      tag="食事精算"
      title="食べた分だけ、気持ちよく割る"
      subtitle="料理ごとに食べた人を選ぶだけで自動計算"
      accent="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"
    />
  );
};
