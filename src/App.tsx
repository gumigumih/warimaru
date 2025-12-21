import { Footer } from './components/templates/Footer';
import { Background } from './components/templates/Background';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPeople, setNonPayingParticipants, setTotalParticipants } from './warimaru/store/peopleSlice';
import { Landing } from './pages/Landing';
import { WaketabeRoutes } from './waketabe/Routes';
import { WarimaruRoutes } from './warimaru/Routes';

const AppRoutes = () => (
  <Background>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/warimaru/*" element={<WarimaruRoutes />} />
      {/* 旧リンク互換 */}
      <Route path="/result" element={<Navigate to="/warimaru/result" replace />} />
      {/* わけたべ */}
      <Route path="/waketabe" element={<Navigate to="/waketabe/participants" replace />} />
      <Route path="/waketabe/*" element={<WaketabeRoutes />} />
    </Routes>
    <Footer />
  </Background>
);

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (encoded) {
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
