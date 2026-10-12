import { useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInputStep } from './pages/ParticipantInputStep';
import { DishInputStep } from './pages/DishInputStep';
import { MealSettlementResult } from './pages/MealSettlementResult';
import { MealSplitHeader } from './components/molecules/WaketabeHeader';
import type { Participant, Dish } from './domain/entities';
import { mealSplitStore, type MealSplitRootState } from './store/store';
import { resetMealSplit, setParticipants, setDishes, setOptions, setLegacy } from './store/waketabeSlice';
import { decodeMealShareData } from './domain/usecases/shareData';

type MealSplitRoutesInnerProps = {
  basePath: string;
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

const MealSplitRoutesInner = ({ basePath }: MealSplitRoutesInnerProps) => {
  const dispatch = useDispatch();
  const stored = useSelector((state: MealSplitRootState) => state.mealSplit);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShareData = new URLSearchParams(location.search).has('data');
  const shareData = useMemo(() => decodeMealSplitShareData(location.search), [location.search]);
  const hasInvalidShareData = hasShareData && !shareData;
  const { participants, dishes, options, legacy } = shareData ?? stored;

  useEffect(() => {
    if (hasShareData) {
      if (!shareData) {
        navigate(`${basePath}/participants`, { replace: true });
        return;
      }

      dispatch(setParticipants(shareData.participants));
      dispatch(setDishes(shareData.dishes));
      dispatch(setOptions(shareData.options));
      dispatch(setLegacy(shareData.legacy));
    }
  }, [basePath, hasShareData, shareData, dispatch, navigate]);

  const handleParticipantsComplete = (newParticipants: Participant[]) => {
    dispatch(setParticipants(newParticipants));
    navigate(`${basePath}/dishes`);
  };

  const handleDishesComplete = (newDishes: Dish[]) => {
    dispatch(setDishes(newDishes));
    dispatch(setLegacy(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: 2, participants, dishes: newDishes, options }))));
    navigate(`${basePath}/result?data=${encoded}`);
  };

  const handleAdjustment = (newParticipants: Participant[], newOptions: typeof options) => {
    dispatch(setParticipants(newParticipants));
    dispatch(setOptions(newOptions));
    dispatch(setLegacy(false));
    const encoded = encodeURIComponent(btoa(encodeURIComponent(JSON.stringify({ version: 2, participants: newParticipants, dishes, options: newOptions }))));
    navigate(`${basePath}/result?data=${encoded}`, { replace: true });
  };

  const handleBackToParticipantInput = () => {
    navigate(`${basePath}/participants`);
  };

  const handleBackToDishInput = () => {
    navigate(`${basePath}/dishes`);
  };

  const handleClear = () => {
    dispatch(resetMealSplit());
    navigate(`${basePath}/participants`);
  };

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <MealSplitHeader />
          <ParticipantInputStep key={location.search} onComplete={handleParticipantsComplete} initialParticipants={participants} onClear={handleClear} />
        </div>
      } />
      <Route path="/dishes" element={hasInvalidShareData || (participants.length === 0 && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <DishInputStep participants={participants} options={options} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} onClear={handleClear} />
        </div>
      )} />
      <Route path="/options" element={<Navigate to={`${basePath}/result${location.search}`} replace />} />
      <Route path="/result" element={hasInvalidShareData || ((participants.length === 0 || dishes.length === 0) && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <MealSettlementResult key={location.search} participants={participants} dishes={dishes} options={options} legacy={legacy} onAdjust={handleAdjustment} onBack={handleBackToDishInput} onClear={handleClear} />
        </div>
      )} />
      <Route path="*" element={<Navigate to={`${basePath}/participants`} replace />} />
    </Routes>
  );
};

type MealSplitRoutesProps = {
  basePath: string;
};

export const MealSplitRoutes = ({ basePath }: MealSplitRoutesProps) => (
  <Provider store={mealSplitStore}>
    <MealSplitRoutesInner basePath={basePath} />
  </Provider>
);
