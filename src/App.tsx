import { Footer } from './components/templates/Footer';
import { Background } from './components/templates/Background';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPeople, setNonPayingParticipants, setTotalParticipants } from './warimaru/store/peopleSlice';
import { Landing } from './pages/Landing';
import { SimpleWarikanRoutes } from './simple-warikan/SimpleWarikanRoutes';
import { MealSplitRoutes } from './waketabe/Routes';
import { EqualSplitRoutes } from './warimaru/Routes';

type LegacyToolRedirectProps = {
  from: string;
  to: string;
};

const LegacyToolRedirect = ({ from, to }: LegacyToolRedirectProps) => {
  const location = useLocation();
  const nextPath = location.pathname.startsWith(from)
    ? `${to}${location.pathname.slice(from.length)}`
    : to;

  return <Navigate to={`${nextPath}${location.search}`} replace />;
};

const AppRoutes = () => (
  <Background>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/simple/*" element={<SimpleWarikanRoutes />} />
      <Route path="/equal-split/*" element={<EqualSplitRoutes basePath="/equal-split" />} />
      <Route path="/meal-split" element={<Navigate to="/meal-split/participants" replace />} />
      <Route path="/meal-split/*" element={<MealSplitRoutes basePath="/meal-split" />} />
      {/* 旧リンク互換 */}
      <Route path="/result" element={<LegacyToolRedirect from="/result" to="/equal-split/result" />} />
      <Route path="/warimaru/*" element={<LegacyToolRedirect from="/warimaru" to="/equal-split" />} />
      <Route path="/waketabe" element={<Navigate to="/meal-split/participants" replace />} />
      <Route path="/waketabe/*" element={<LegacyToolRedirect from="/waketabe" to="/meal-split" />} />
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
