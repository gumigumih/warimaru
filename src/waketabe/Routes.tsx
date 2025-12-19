import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ParticipantInput } from './components/organisms/ParticipantInput';
import { DishInput } from './components/organisms/DishInput';
import { CalculationResultScreen } from './components/organisms/CalculationResult';
import { WaketabeHeader } from './components/organisms/WaketabeHeader';
import type { Participant, Dish } from './domain/entities';
import { waketabeStore, type WaketabeRootState } from './store/store';
import { setParticipants, setDishes } from './store/waketabeSlice';

const WaketabeRoutesInner = () => {
  const dispatch = useDispatch();
  const participants = useSelector((state: WaketabeRootState) => state.waketabe.participants);
  const dishes = useSelector((state: WaketabeRootState) => state.waketabe.dishes);
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
    navigate('/waketabe/dishes');
  };

  const handleDishesComplete = (newDishes: Dish[]) => {
    dispatch(setDishes(newDishes));
    navigate('/waketabe/result');
  };

  const handleBackToParticipantInput = () => {
    navigate('/waketabe/participants');
  };

  const handleBackToDishInput = () => {
    navigate('/waketabe/dishes');
  };

  if (restoring) {
    return <div className="flex flex-col items-center justify-center min-h-[40vh] text-lg text-gray-100">データ復元中...</div>;
  }

  return (
    <Routes>
      <Route path="/participants" element={
        <div className="space-y-4">
          <WaketabeHeader />
          <ParticipantInput onComplete={handleParticipantsComplete} initialParticipants={participants} />
        </div>
      } />
      <Route path="/dishes" element={participants.length === 0 && !location.search.includes('data=') ? <Navigate to="/waketabe/participants" /> : (
        <div className="space-y-4">
          <WaketabeHeader />
          <DishInput participants={participants} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} />
        </div>
      )} />
      <Route path="/result" element={(participants.length === 0 || dishes.length === 0) && !location.search.includes('data=') ? <Navigate to="/waketabe/participants" /> : (
        <div className="space-y-4">
          <WaketabeHeader />
          <CalculationResultScreen participants={participants} dishes={dishes} onBack={handleBackToDishInput} />
        </div>
      )} />
      <Route path="*" element={<Navigate to="/waketabe/participants" replace />} />
    </Routes>
  );
};

export const WaketabeRoutes = () => (
  <Provider store={waketabeStore}>
    <WaketabeRoutesInner />
  </Provider>
);
