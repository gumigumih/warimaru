import { InputForm } from './warimaru/components/organisms/InputForm';
import { PaymentResult } from './warimaru/components/organisms/PaymentResult';
import { Header } from './components/templates/Header';
import { Footer } from './components/templates/Footer';
import { Background } from './components/templates/Background';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPeople, setNonPayingParticipants } from './warimaru/store/peopleSlice';
import { Landing } from './pages/Landing';
import { WaketabeRoutes } from './waketabe/Routes';

function AppRoutes() {
  const navigate = useNavigate();

  // 入力画面→結果画面への遷移
  const handleShowResult = (shareData: { people: { name: string; payments: { amount: number }[] }[]; nonPayingParticipants: number }) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    navigate(`/warimaru/result?data=${encoded}`);
  };

  // 結果画面→入力画面への遷移
  const handleBack = () => {
    navigate('/warimaru');
  };

  return (
    <Background>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/warimaru" element={<>
          <Header />
          <InputForm onShowResult={handleShowResult} />
        </>} />
        <Route path="/warimaru/result" element={<>
          <Header />
          <PaymentResult onBack={handleBack} />
        </>} />
        {/* 旧リンク互換 */}
        <Route path="/result" element={<Navigate to="/warimaru/result" replace />} />
        {/* わけたべ */}
        <Route path="/waketabe" element={<Navigate to="/waketabe/participants" replace />} />
        <Route path="/waketabe/*" element={<WaketabeRoutes />} />
      </Routes>
      <Footer />
    </Background>
  );
}

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
        dispatch(setPeople(decoded.people));
        dispatch(setNonPayingParticipants(decoded.nonPayingParticipants));
      } catch {
        // データ不正時は何もしない
      }
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default App
