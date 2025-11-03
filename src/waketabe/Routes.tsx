import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ParticipantInput } from './components/organisms/ParticipantInput';
import { DishInput } from './components/organisms/DishInput';
import { CalculationResultScreen } from './components/organisms/CalculationResult';
import type { Participant, Dish } from './domain/entities';

export const WaketabeRoutes = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
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
          setParticipants(parsed.participants);
        }
        if (parsed.dishes && Array.isArray(parsed.dishes)) {
          setDishes(parsed.dishes);
        }
      } catch {}
      setTimeout(() => setRestoring(false), 0);
    }
  }, [location.search]);

  const handleParticipantsComplete = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    navigate('/waketabe/dishes');
  };

  const handleDishesComplete = (newDishes: Dish[]) => {
    setDishes(newDishes);
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
      <Route path="/participants" element={<ParticipantInput onComplete={handleParticipantsComplete} initialParticipants={participants} />} />
      <Route path="/dishes" element={participants.length === 0 && !location.search.includes('data=') ? <Navigate to="/waketabe/participants" /> : (
        <DishInput participants={participants} onComplete={handleDishesComplete} onBack={handleBackToParticipantInput} initialDishes={dishes} />
      )} />
      <Route path="/result" element={(participants.length === 0 || dishes.length === 0) && !location.search.includes('data=') ? <Navigate to="/waketabe/participants" /> : (
        <CalculationResultScreen participants={participants} dishes={dishes} onBack={handleBackToDishInput} />
      )} />
      <Route path="*" element={<Navigate to="/waketabe/participants" replace />} />
    </Routes>
  );
};

