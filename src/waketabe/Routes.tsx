import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInputStep } from './pages/ParticipantInputStep';
import { DishInputStep } from './pages/DishInputStep';
import { MealSettlementResult } from './pages/MealSettlementResult';
import { MealSplitHeader } from './components/molecules/WaketabeHeader';
import type { Participant, Dish } from './domain/entities';
import { mealSplitStore, type MealSplitRootState } from './store/store';
import { resetMealSplit, setParticipants, setDishes } from './store/waketabeSlice';

type MealSplitRoutesInnerProps = {
  basePath: string;
};

const isMealSplitShareData = (data: unknown): data is {
  participants: Participant[];
  dishes: Dish[];
} => {
  if (!data || typeof data !== 'object') return false;

  const value = data as { participants?: unknown; dishes?: unknown };
  if (!Array.isArray(value.participants) || !Array.isArray(value.dishes)) return false;

  const hasValidParticipants = value.participants.every(participant => {
    if (!participant || typeof participant !== 'object') return false;
    const participantValue = participant as { id?: unknown; name?: unknown };
    return typeof participantValue.id === 'string' && typeof participantValue.name === 'string';
  });

  const hasValidDishes = value.dishes.every(dish => {
    if (!dish || typeof dish !== 'object') return false;
    const dishValue = dish as {
      id?: unknown;
      name?: unknown;
      price?: unknown;
      eaters?: unknown;
    };
    return (
      typeof dishValue.id === 'string' &&
      typeof dishValue.name === 'string' &&
      typeof dishValue.price === 'string' &&
      Array.isArray(dishValue.eaters) &&
      dishValue.eaters.every(eaterId => typeof eaterId === 'string')
    );
  });

  return hasValidParticipants && hasValidDishes;
};

const decodeMealSplitShareData = (search: string) => {
  const dataParam = new URLSearchParams(search).get('data');
  if (!dataParam) return null;

  try {
    const decoded = decodeURIComponent(atob(dataParam));
    const parsed = JSON.parse(decoded);
    return isMealSplitShareData(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const MealSplitRoutesInner = ({ basePath }: MealSplitRoutesInnerProps) => {
  const dispatch = useDispatch();
  const participants = useSelector((state: MealSplitRootState) => state.mealSplit.participants);
  const dishes = useSelector((state: MealSplitRootState) => state.mealSplit.dishes);
  const [restoring, setRestoring] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasShareData = new URLSearchParams(location.search).has('data');
  const shareData = useMemo(() => decodeMealSplitShareData(location.search), [location.search]);
  const hasInvalidShareData = hasShareData && !shareData;

  useEffect(() => {
    if (hasShareData) {
      setRestoring(true);

      if (!shareData) {
        setRestoring(false);
        navigate(`${basePath}/participants`, { replace: true });
        return;
      }

      dispatch(setParticipants(shareData.participants));
      dispatch(setDishes(shareData.dishes));
      setTimeout(() => setRestoring(false), 0);
    }
  }, [basePath, hasShareData, shareData, dispatch, navigate]);

  const handleParticipantsComplete = (newParticipants: Participant[]) => {
    dispatch(setParticipants(newParticipants));
    navigate(`${basePath}/dishes`);
  };

  const handleDishesComplete = (newDishes: Dish[]) => {
    dispatch(setDishes(newDishes));
    navigate(`${basePath}/result`);
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

  if (restoring) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-lg text-gray-100">データ復元中...</div>;
  }

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <MealSplitHeader />
          <ParticipantInputStep onComplete={handleParticipantsComplete} initialParticipants={participants} onClear={handleClear} />
        </div>
      } />
      <Route path="/dishes" element={hasInvalidShareData || (participants.length === 0 && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <DishInputStep participants={participants} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} onClear={handleClear} />
        </div>
      )} />
      <Route path="/result" element={hasInvalidShareData || ((participants.length === 0 || dishes.length === 0) && !hasShareData) ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <MealSettlementResult participants={participants} dishes={dishes} onBack={handleBackToDishInput} onClear={handleClear} />
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
