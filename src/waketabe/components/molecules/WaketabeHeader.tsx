import { faRoute } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../../components/templates/BrandHeader";

export const MealSplitHeader = () => {
  return (
    <BrandHeader
    icon={faRoute}
    tag="項目別精算"
    title="食べた料理・使った項目だけで払う"
    subtitle="料理・宿代・交通費などを、対象者ごとに自動計算"
    accent="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
    />
  );
};
