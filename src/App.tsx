import { InputForm } from './components/organisms/InputForm';
import { PaymentResult } from './components/organisms/PaymentResult';
import { Header } from './components/templates/Header';
import { Footer } from './components/templates/Footer';
import { Background } from './components/templates/Background';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPeople, setNonPayingParticipants } from './store/peopleSlice';

function AppRoutes() {
  const navigate = useNavigate();

  // 入力画面→結果画面への遷移
  const handleShowResult = (shareData: { people: { name: string; payments: { amount: number }[] }[]; nonPayingParticipants: number }) => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
    navigate(`/result?data=${encoded}`);
  };

  // 結果画面→入力画面への遷移
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Background>
      <Header />
      <Routes>
        <Route path="/" element={<InputForm onShowResult={handleShowResult} />} />
        <Route path="/result" element={<PaymentResult onBack={handleBack} />} />
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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App
