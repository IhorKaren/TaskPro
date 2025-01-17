import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useAuth } from 'hooks/useAuth';
import { refreshUser } from 'redux/auth/authOperations';
import { PrivateRoute } from '../PrivateRoute/PrivateRoute';
import { RestrictedRoute } from 'RestrictedRoute/RestrictedRoute';
import Layout from './layout/Layout';
import { selectUser } from 'redux/auth/authSelectors';
import { useSelector } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getThemePalette from 'components/Theme/getThemePalette';
import { Container } from './App.styled';
import RefreshUser from './loaders/RefreshUser';

const HomePage = lazy(() => import('screens/HomePage/HomePage'));
const WelcomePage = lazy(() => import('../screens/WelcomePage/WelcomePage'));
const LoginForm = lazy(() => import('./FormLogin/LoginForm'));
const RegisterForm = lazy(() => import('./FormRegister/RegisterForm'));
const ScrensPage = lazy(() => import('../components/ScreensPage/ScreensPage'));

export const App = () => {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();
  const user = useSelector(selectUser);

  const theme = createTheme(getThemePalette(user.theme));
  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={null}>
        {isRefreshing ? (
          <Container>
            <RefreshUser />
          </Container>
        ) : (
          <>
            <Toaster />
            <Routes>
              <Route
                index
                element={
                  <RestrictedRoute
                    component={<WelcomePage />}
                    redirectTo="/home"
                  />
                }
              />
              <Route
                path="/auth/login"
                element={
                  <RestrictedRoute
                    component={<LoginForm />}
                    redirectTo="/home"
                  />
                }
              />
              <Route
                path="/auth/register"
                element={
                  <RestrictedRoute
                    component={<RegisterForm />}
                    redirectTo="/home"
                  />
                }
              />
              <Route
                path="/home"
                element={
                  <Layout>
                    <PrivateRoute component={<HomePage />} redirectTo="/" />
                  </Layout>
                }
              />
              <Route
                path="/home/:boardName"
                element={
                  <Layout>
                    <PrivateRoute
                      component={<ScrensPage />}
                      redirectTo="/auth/login"
                    />
                  </Layout>
                }
              />
            </Routes>
          </>
        )}
      </Suspense>
    </ThemeProvider>
  );
};
