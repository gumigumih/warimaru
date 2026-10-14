import { ItemSplitRoutes } from '../shared/routes/ItemSplitRoutes';
import { DishInputStep } from './pages/DishInputStep';
import { PotluckInputStep } from './pages/PotluckInputStep';

type MealSplitRoutesProps = {
  basePath: string;
  potluck?: boolean;
};

// 旧importと既存の共有URLを維持する互換アダプター。
export const MealSplitRoutes = ({ basePath, potluck = false }: MealSplitRoutesProps) => (
  <ItemSplitRoutes
    basePath={basePath}
    potluck={potluck}
    version={potluck ? 3 : 2}
    potluckBasePath="/potluck-split"
    inputStep={potluck ? PotluckInputStep : DishInputStep}
  />
);
