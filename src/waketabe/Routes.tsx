import { ItemSplitRoutes } from '../shared/routes/ItemSplitRoutes';
import { DishInputStep } from '../tools/meal-split/pages/DishInputStep';
import { PotluckInputStep } from '../tools/potluck-split/pages/PotluckInputStep';

type MealSplitRoutesProps = {
  basePath: string;
  potluck?: boolean;
};

// 旧importと既存の共有URLを維持する互換アダプター。
// 旧importの利用箇所と旧URLの流入がなくなり、移行確認が済んだ時点で削除する。
export const MealSplitRoutes = ({ basePath, potluck = false }: MealSplitRoutesProps) => (
  <ItemSplitRoutes
    basePath={basePath}
    potluck={potluck}
    version={potluck ? 3 : 2}
    potluckBasePath="/potluck-split"
    inputStep={potluck ? PotluckInputStep : DishInputStep}
  />
);
