import { ItemSplitRoutes } from '../../shared/routes/ItemSplitRoutes';
import { PotluckInputStep } from './pages/PotluckInputStep';

export const PotluckSplitRoutes = () => (
  <ItemSplitRoutes
    basePath="/potluck-split"
    potluck={true}
    version={3}
    inputStep={PotluckInputStep}
  />
);
