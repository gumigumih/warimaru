import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PaymentInputStep } from './pages/PaymentInputStep';
import { SettlementResult } from './pages/SettlementResult';
import { Header } from './components/Header';
import { ParticipantCountStep } from './pages/ParticipantCountStep';
import { setNonPayingParticipants, setPeople, setTotalParticipants } from './store/peopleSlice';
import type { AppDispatch } from './store/store';

export const WarimaruRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encoded = params.get('data');
    if (!encoded) return;

    try {
      const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
      if (decoded.people) {
        dispatch(setPeople(decoded.people));
      }
      if (typeof decoded.totalParticipants === 'number') {
        dispatch(setTotalParticipants(decoded.totalParticipants));
      } else if (typeof decoded.nonPayingParticipants === 'number') {
        dispatch(setNonPayingParticipants(decoded.nonPayingParticipants));
      }
    } catch {
      // 不正データは無視
    }
  }, [location.search, dispatch]);

  const handleShowResult = (shareData: { people: { name: string; payments: { amount: number }[] }[]; totalParticipants: number; nonPayingParticipants: number }) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    navigate(`/warimaru/result?data=${encoded}`);
  };

  const handleTotalParticipantsComplete = () => {
    navigate('/warimaru/payments');
  };

  const handleBackToTotal = () => {
    navigate('/warimaru');
  };

  const handleBack = () => {
    navigate('/warimaru/payments');
  };

  return (
    <Routes>
      <Route
        index
        element={<>
          <Header />
          <ParticipantCountStep onNext={handleTotalParticipantsComplete} />
        </>}
      />
      <Route
        path="payments"
        element={<>
          <Header />
          <PaymentInputStep onShowResult={handleShowResult} onBack={handleBackToTotal} />
        </>}
      />
      <Route
        path="result"
        element={<>
          <Header />
          <SettlementResult onBack={handleBack} />
        </>}
      />
      <Route path="*" element={<Navigate to="/warimaru" replace />} />
    </Routes>
  );
};
