import { useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInputStep } from './pages/ParticipantInputStep';
import { DishInputStep } from './pages/DishInputStep';
import { PotluckInputStep } from './pages/PotluckInputStep';
import { MealSettlementResult } from './pages/MealSettlementResult';
import { MealSplitHeader } from './components/molecules/WaketabeHeader';
import type { Participant, Dish } from './domain/entities';
import { mealSplitStore, potluckSplitStore, type MealSplitRootState } from './store/store';
import { resetMealSplit, setParticipants, setDishes, setOptions, setLegacy } from './store/waketabeSlice';
import { decodeMealShareData } from './domain/usecases/shareData';

type MealSplitRoutesInnerProps = {
  basePath: string;
  potluck: boolean;
};

const decodeMealSplitShareData = (search: string) => {
  const dataParam = new URLSearchParams(search).get('data');
  if (!dataParam) return null;

  try {
    const decoded = decodeURIComponent(atob(dataParam.replace(/ /g, '+')));
    const parsed = JSON.parse(decoded);
    return decodeMealShareData(parsed);
  } catch {
    return null;
  }
};

const MealSplitRoutesInner = ({ basePath, potluck }: MealSplitRoutesInnerProps) => {
  const dispatch = useDispatch();
  const stored = useSelector((state: MealSplitRootState) => state.mealSplit);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShareData = new URLSearchParams(location.search).has('data');
  const shareData = useMemo(() => decodeMealSplitShareData(location.search), [location.search]);
  const hasInvalidShareData = hasShareData && !shareData;
  const { participants, dishes, options, legacy } = shareData ?? stored;
  const redirectToPotluck = !potluck && !!shareData?.dishes.some(dish => dish.payments);
  const InputStep = potluck ? PotluckInputStep : DishInputStep;

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
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: potluck ? 3 : 2, participants, dishes: newDishes, options }))));
    navigate(`${basePath}/result?data=${encoded}`);
  };

  const handleAdjustment = (newParticipants: Participant[], newOptions: typeof options) => {
    dispatch(setParticipants(newParticipants));
    dispatch(setOptions(newOptions));
    dispatch(setLegacy(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: potluck ? 3 : 2, participants: newParticipants, dishes, options: newOptions }))));
    navigate(`${basePath}/result?data=${encoded}`, { replace: true });
  };

  const handleBackToParticipantInput = (draftDishes: Dish[]) => {
    dispatch(setDishes(draftDishes));
    navigate(`${basePath}/participants`);
  };

  const handleBackToDishInput = () => {
    navigate(`${basePath}/dishes`);
  };

  const handleClear = () => {
    dispatch(resetMealSplit());
    navigate(`${basePath}/participants`);
  };

  if (redirectToPotluck) return <Navigate to={'/potluck-split' + location.pathname.slice(basePath.length) + location.search} replace />;

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <MealSplitHeader potluck={potluck} />
          <ParticipantInputStep key={location.search} onComplete={handleParticipantsComplete} initialParticipants={participants} onClear={handleClear} />
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
          <MealSettlementResult key={location.search} basePath={basePath} potluck={potluck} participants={participants} dishes={dishes} options={options} legacy={legacy} onAdjust={handleAdjustment} onBack={handleBackToDishInput} onClear={handleClear} />
        </div>
      )} />
      <Route path="*" element={<Navigate to={`${basePath}/participants`} replace />} />
    </Routes>
  );
};

type MealSplitRoutesProps = {
  basePath: string;
  potluck?: boolean;
};

export const MealSplitRoutes = ({ basePath, potluck = false }: MealSplitRoutesProps) => (
  <Provider store={potluck ? potluckSplitStore : mealSplitStore}>
    <MealSplitRoutesInner key={basePath} basePath={basePath} potluck={potluck} />
  </Provider>
);
