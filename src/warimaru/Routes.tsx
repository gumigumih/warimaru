import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { PaymentInputStep } from './pages/PaymentInputStep';
import { SettlementResult } from './pages/SettlementResult';
import { Header } from './components/Header';
import { ParticipantCountStep } from './pages/ParticipantCountStep';
import { setNonPayingParticipants, setPeople, setTotalParticipants } from './store/peopleSlice';
import type { AppDispatch } from './store/store';

type EqualSplitRoutesProps = {
  basePath: string;
};

const isEqualSplitShareData = (data: unknown): data is {
  people: { name: string; payments: { amount: number }[] }[];
  totalParticipants?: number;
  nonPayingParticipants?: number;
} => {
  if (!data || typeof data !== 'object') return false;

  const value = data as {
    people?: unknown;
    totalParticipants?: unknown;
    nonPayingParticipants?: unknown;
  };

  if (!Array.isArray(value.people)) return false;
  if (typeof value.totalParticipants !== 'number' && typeof value.nonPayingParticipants !== 'number') {
    return false;
  }

  return value.people.every(person => {
    if (!person || typeof person !== 'object') return false;
    const personValue = person as { name?: unknown; payments?: unknown };
    return (
      typeof personValue.name === 'string' &&
      Array.isArray(personValue.payments) &&
      personValue.payments.every(payment => {
        if (!payment || typeof payment !== 'object') return false;
        return typeof (payment as { amount?: unknown }).amount === 'number';
      })
    );
  });
};

const decodeEqualSplitShareData = (search: string) => {
  const encoded = new URLSearchParams(search).get('data');
  if (!encoded) return null;

  try {
    const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
    return isEqualSplitShareData(decoded) ? decoded : null;
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
    if (typeof shareData.totalParticipants === 'number') {
      dispatch(setTotalParticipants(shareData.totalParticipants));
      return;
    }
    dispatch(setNonPayingParticipants(shareData.nonPayingParticipants ?? 0));
  }, [basePath, hasShareData, shareData, dispatch, navigate]);

  const handleShowResult = (shareData: { people: { name: string; payments: { amount: number }[] }[]; totalParticipants: number; nonPayingParticipants: number }) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    navigate(`${basePath}/result?data=${encoded}`);
  };

  const handleTotalParticipantsComplete = () => {
    navigate(`${basePath}/payments`);
  };

  const handleBackToTotal = () => {
    navigate(basePath);
  };

  const handleBack = () => {
    navigate(`${basePath}/payments`);
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
        element={hasInvalidShareData ? <Navigate to={basePath} replace /> : (
          <>
            <Header />
            <SettlementResult onBack={handleBack} />
          </>
        )}
      />
      <Route path="*" element={<Navigate to={basePath} replace />} />
    </Routes>
  );
};
