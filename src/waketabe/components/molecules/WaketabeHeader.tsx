import { faRoute, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { BrandHeader } from "../../../components/templates/BrandHeader";

export const MealSplitHeader = ({ potluck = false }: { potluck?: boolean }) => {
  return (
    <BrandHeader
    icon={potluck ? faRoute : faUtensils}
    tag={potluck ? '持ち寄り精算' : '食事割り勘'}
    title={potluck ? '持ち寄り飲み会を精算する' : 'レストランで食べた分だけ割る'}
    subtitle={potluck ? '酒代は飲む人だけ、料理代は全員。みんなの立替をまとめて精算' : '料理ごとに、食べた人だけを選んで割り勘'}
    accent={potluck ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500'}
    />
  );
};
