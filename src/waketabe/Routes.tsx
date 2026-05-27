import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInputStep } from './pages/ParticipantInputStep';
import { DishInputStep } from './pages/DishInputStep';
import { MealSettlementResult } from './pages/MealSettlementResult';
import { MealSplitHeader } from './components/molecules/WaketabeHeader';
import type { Participant, Dish } from './domain/entities';
import { mealSplitStore, type MealSplitRootState } from './store/store';
import { setParticipants, setDishes } from './store/waketabeSlice';

type MealSplitRoutesInnerProps = {
  basePath: string;
};

const MealSplitRoutesInner = ({ basePath }: MealSplitRoutesInnerProps) => {
  const dispatch = useDispatch();
  const participants = useSelector((state: MealSplitRootState) => state.mealSplit.participants);
  const dishes = useSelector((state: MealSplitRootState) => state.mealSplit.dishes);
  const [restoring, setRestoring] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dataParam = params.get('data');
    if (dataParam) {
      setRestoring(true);
      try {
        const decoded = decodeURIComponent(atob(dataParam));
        const parsed = JSON.parse(decoded);
        if (parsed.participants && Array.isArray(parsed.participants)) {
          dispatch(setParticipants(parsed.participants));
        }
        if (parsed.dishes && Array.isArray(parsed.dishes)) {
          dispatch(setDishes(parsed.dishes));
        }
      } catch {}
      setTimeout(() => setRestoring(false), 0);
    }
  }, [location.search, dispatch]);

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

  if (restoring) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-lg text-gray-100">データ復元中...</div>;
  }

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <MealSplitHeader />
          <ParticipantInputStep onComplete={handleParticipantsComplete} initialParticipants={participants} />
        </div>
      } />
      <Route path="/dishes" element={participants.length === 0 && !location.search.includes('data=') ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <DishInputStep participants={participants} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} />
        </div>
      )} />
      <Route path="/result" element={(participants.length === 0 || dishes.length === 0) && !location.search.includes('data=') ? <Navigate to={`${basePath}/participants`} /> : (
        <div className="space-y-4">
          <MealSplitHeader />
          <MealSettlementResult participants={participants} dishes={dishes} onBack={handleBackToDishInput} />
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
