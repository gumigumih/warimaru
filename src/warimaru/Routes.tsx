import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { InputForm } from './components/organisms/InputForm';
import { PaymentResult } from './components/organisms/PaymentResult';
import { Header } from '../components/templates/Header';

export const WarimaruRoutes = () => {
  const navigate = useNavigate();

  const handleShowResult = (shareData: { people: { name: string; payments: { amount: number }[] }[]; nonPayingParticipants: number }) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    navigate(`/warimaru/result?data=${encoded}`);
  };

  const handleBack = () => {
    navigate('/warimaru');
  };

  return (
    <Routes>
      <Route index element={<>
        <Header />
        <InputForm onShowResult={handleShowResult} />
      </>} />
      <Route path="result" element={<>
        <Header />
        <PaymentResult onBack={handleBack} />
      </>} />
      <Route path="*" element={<Navigate to="/warimaru" replace />} />
    </Routes>
  );
};
