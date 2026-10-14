import { ItemSplitRoutes } from '../../shared/routes/ItemSplitRoutes';
import { DishInputStep } from './pages/DishInputStep';

export const MealSplitRoutes = () => (
  <ItemSplitRoutes
    basePath="/meal-split"
    potluck={false}
    version={2}
    potluckBasePath="/potluck-split"
    inputStep={DishInputStep}
  />
);
