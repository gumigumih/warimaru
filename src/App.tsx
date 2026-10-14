import { Background, Footer } from './shared/components';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPeople, setMembers, setRounding, setLegacyEqual, setTotalParticipants } from './warimaru/store/peopleSlice';
import { decodeEqualShareData } from './warimaru/domain/usecases/shareData';
import { Landing } from './pages/Landing';
import { SimpleWarikanRoutes } from './simple-warikan/SimpleWarikanRoutes';
import { MealSplitRoutes } from './tools/meal-split/Routes';
import { PotluckSplitRoutes } from './tools/potluck-split/Routes';
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
      <Route path="/meal-split/*" element={<MealSplitRoutes />} />
      <Route path="/potluck-split/*" element={<PotluckSplitRoutes />} />
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
    // Result-route data takes precedence over the query on an old shared URL.
    if (new URLSearchParams(window.location.hash.split('?')[1]).has('data')) return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('data');
    if (encoded) {
      try {
        const decoded = decodeEqualShareData(JSON.parse(decodeURIComponent(atob(encoded.replace(/ /g, '+')))));
        if (decoded) {
          dispatch(setPeople(decoded.people));
          dispatch(setTotalParticipants(decoded.totalParticipants));
          dispatch(setMembers(decoded.members));
          dispatch(setRounding(decoded.rounding));
          dispatch(setLegacyEqual(decoded.legacy));
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
