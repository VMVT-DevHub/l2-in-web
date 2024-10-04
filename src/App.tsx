import { useContext } from 'react';
import { Location, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultLayout from './components/DefaultLayout';
import FullscreenLoader from './components/FullscreenLoader';
import LoginLayout from './components/LoginLayout';
import { UserContext, UserContextType } from './components/UserProvider';
import Login from './Pages/Login';
import { routes, slugs } from './utils/routes';

interface RouteProps {
  loggedIn: boolean;
  defaultUrl: string;
  location?: Location;
}

const getDefaultUrl = ({ loggedIn }: { loggedIn: boolean }) => {
  if (!loggedIn) return slugs.login;

  return slugs.certificates;
};

function App() {
  const location = useLocation();
  const { loggedIn, isLoading } = useContext<UserContextType>(UserContext);
  const defaultUrl = getDefaultUrl({ loggedIn });

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return (
    <>
      <Routes>
        <Route element={<PublicRoute defaultUrl={defaultUrl} loggedIn={loggedIn} />}>
          <Route path={slugs.login} element={<Login />} />
        </Route>
        <Route
          element={
            <ProtectedRoute defaultUrl={defaultUrl} location={location} loggedIn={loggedIn} />
          }
        >
          {(routes || []).map((route, index) => {
            return <Route key={`route-${index}`} path={route.slug} element={route.component} />;
          })}
        </Route>
        <Route path="*" element={<Navigate to={defaultUrl} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

const PublicRoute = ({ loggedIn, defaultUrl }: RouteProps) => {
  if (loggedIn) {
    return <Navigate to={defaultUrl} replace />;
  }

  return (
    <LoginLayout>
      <Outlet />
    </LoginLayout>
  );
};

const ProtectedRoute = ({ loggedIn, defaultUrl }: RouteProps) => {
  return !loggedIn ? (
    <Navigate to={defaultUrl} replace />
  ) : (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
};

export default App;
