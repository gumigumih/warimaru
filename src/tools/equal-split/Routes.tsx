import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { PaymentInputStep } from './pages/PaymentInputStep';
import { SettlementResult } from './pages/SettlementResult';
import { Header } from './components/Header';
import { ParticipantCountStep } from './pages/ParticipantCountStep';
import { resetPeople, setMembers, setRounding, setLegacyEqual, setPeople, setTotalParticipants } from './store/peopleSlice';
import type { AppDispatch } from './store/store';
import { decodeEqualShareData } from './domain/usecases/shareData';

type EqualSplitRoutesProps = {
  basePath: string;
};

const decodeEqualSplitShareData = (search: string) => {
  const encoded = new URLSearchParams(search).get('data');
  if (!encoded) return null;

  try {
    return decodeEqualShareData(JSON.parse(decodeURIComponent(atob(encoded.replace(/ /g, '+')))));
  } catch {
    return null;
  }
};

export const EqualSplitRoutes = ({ basePath }: EqualSplitRoutesProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const hasShareData = new URLSearchParams(location.search).has('data');
  const shareData = useMemo(() => decodeEqualSplitShareData(location.search), [location.search]);
  const hasInvalidShareData = hasShareData && !shareData;

  useEffect(() => {
    if (!hasShareData) return;
    if (!shareData) {
      navigate(basePath, { replace: true });
      return;
    }

    dispatch(setPeople(shareData.people));
    dispatch(setTotalParticipants(shareData.totalParticipants));
    dispatch(setMembers(shareData.members));
    dispatch(setRounding(shareData.rounding));
    dispatch(setLegacyEqual(shareData.legacy));
  }, [basePath, hasShareData, shareData, dispatch, navigate]);

  const handlePayersComplete = () => {
    navigate(`${basePath}/participants`);
  };

  const handleTotalParticipantsComplete = () => {
    navigate(`${basePath}/result`);
  };

  const handleBackToPayers = () => {
    navigate(basePath);
  };

  const handleBack = () => {
    navigate(`${basePath}/participants`);
  };

  const handleClear = () => {
    dispatch(resetPeople());
    navigate(basePath);
  };

  return (
    <Routes>
      <Route
        index
        element={<>
          <Header />
          <PaymentInputStep onNext={handlePayersComplete} onClear={handleClear} />
        </>}
      />
      <Route
        path="participants"
        element={<>
          <Header />
          <ParticipantCountStep onNext={handleTotalParticipantsComplete} onBack={handleBackToPayers} onClear={handleClear} />
        </>}
      />
      <Route path="payments" element={<Navigate to={basePath} replace />} />
      <Route
        path="result"
        element={hasInvalidShareData ? <Navigate to={basePath} replace /> : (
          <>
            <Header />
            <SettlementResult key={location.search} data={shareData ?? undefined} onBack={handleBack} onClear={handleClear} />
          </>
        )}
      />
      <Route path="*" element={<Navigate to={basePath} replace />} />
    </Routes>
  );
};
