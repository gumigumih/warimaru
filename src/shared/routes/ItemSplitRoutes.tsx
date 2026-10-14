import { useEffect, useMemo, type ComponentType } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInputStep } from '../../waketabe/pages/ParticipantInputStep';
import { ItemSplitResult } from '../components/ItemSplitResult';
import { MealSplitHeader } from '../../waketabe/components/molecules/WaketabeHeader';
import type { Participant, Dish, SplitOptions } from '../../waketabe/domain/entities';
import { mealSplitStore, potluckSplitStore, type MealSplitRootState } from '../../waketabe/store/store';
import { resetMealSplit, setParticipants, setDishes, setOptions, setLegacy } from '../../waketabe/store/waketabeSlice';
import { decodeMealShareData } from '../../waketabe/domain/usecases/shareData';

type ItemInputStepProps = {
  participants: Participant[];
  options?: SplitOptions;
  onComplete?: (dishes: Dish[]) => void;
  onBack?: (dishes: Dish[]) => void;
  initialDishes?: Dish[];
  onClear?: () => void;
};

type ItemSplitRoutesProps = {
  basePath: string;
  potluck: boolean;
  version: 2 | 3;
  potluckBasePath?: string;
  inputStep: ComponentType<ItemInputStepProps>;
};

const decodeMealSplitShareData = (search: string) => {
  const dataParam = new URLSearchParams(search).get('data');
  if (!dataParam) return null;

  try {
    const decoded = decodeURIComponent(atob(dataParam.replace(/ /g, '+')));
    return decodeMealShareData(JSON.parse(decoded));
  } catch {
    return null;
  }
};

const ItemSplitRoutesInner = ({ basePath, potluck, version, potluckBasePath, inputStep: InputStep }: ItemSplitRoutesProps) => {
  const dispatch = useDispatch();
  const stored = useSelector((state: MealSplitRootState) => state.mealSplit);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShareData = new URLSearchParams(location.search).has('data');
  const shareData = useMemo(() => decodeMealSplitShareData(location.search), [location.search]);
  const hasInvalidShareData = hasShareData && !shareData;
  const { participants, dishes, options, legacy } = shareData ?? stored;
  const redirectToPotluck = !potluck && !!shareData?.dishes.some(dish => dish.payments);

  useEffect(() => {
    if (hasShareData && !redirectToPotluck) {
      if (!shareData) {
        navigate(`${basePath}/participants`, { replace: true });
        return;
      }

      dispatch(setParticipants(shareData.participants));
      dispatch(setDishes(shareData.dishes));
      dispatch(setOptions(shareData.options));
      dispatch(setLegacy(shareData.legacy));
    }
  }, [basePath, hasShareData, shareData, dispatch, navigate, redirectToPotluck]);

  const handleParticipantsComplete = (newParticipants: Participant[]) => {
    dispatch(setParticipants(newParticipants));
    navigate(`${basePath}/dishes`);
  };

  const handleDishesComplete = (newDishes: Dish[]) => {
    dispatch(setDishes(newDishes));
    dispatch(setLegacy(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version, participants, dishes: newDishes, options }))));
    navigate(`${basePath}/result?data=${encoded}`);
  };

  const handleAdjustment = (newParticipants: Participant[], newOptions: SplitOptions) => {
    dispatch(setParticipants(newParticipants));
    dispatch(setOptions(newOptions));
    dispatch(setLegacy(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version, participants: newParticipants, dishes, options: newOptions }))));
    navigate(`${basePath}/result?data=${encoded}`, { replace: true });
  };

  const handleBackToParticipantInput = (draftDishes: Dish[]) => {
    dispatch(setDishes(draftDishes));
    navigate(`${basePath}/participants`);
  };

  const handleClear = () => {
    dispatch(resetMealSplit());
    navigate(`${basePath}/participants`);
  };

  if (redirectToPotluck && potluckBasePath) {
    return <Navigate to={`${potluckBasePath}${location.pathname.slice(basePath.length)}${location.search}`} replace />;
  }

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <MealSplitHeader potluck={potluck} />
          <ParticipantInputStep key={location.search} potluck={potluck} onComplete={handleParticipantsComplete} initialParticipants={participants} onClear={handleClear} />
        </div>
      } />
      <Route path="/dishes" element={hasInvalidShareData || (participants.length === 0 && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader potluck={potluck} />
          <InputStep participants={participants} options={options} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} onClear={handleClear} />
        </div>
      )} />
      <Route path="/options" element={<Navigate to={`${basePath}/result${location.search}`} replace />} />
      <Route path="/result" element={hasInvalidShareData || ((participants.length === 0 || dishes.length === 0) && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader potluck={potluck} />
          <ItemSplitResult key={location.search} basePath={basePath} potluck={potluck} participants={participants} dishes={dishes} options={options} legacy={legacy} onAdjust={handleAdjustment} onBack={() => navigate(`${basePath}/dishes`)} onClear={handleClear} />
        </div>
      )} />
      <Route path="*" element={<Navigate to={`${basePath}/participants`} replace />} />
    </Routes>
  );
};

export const ItemSplitRoutes = (props: ItemSplitRoutesProps) => (
  <Provider store={props.potluck ? potluckSplitStore : mealSplitStore}>
    <ItemSplitRoutesInner key={props.basePath} {...props} />
  </Provider>
);
