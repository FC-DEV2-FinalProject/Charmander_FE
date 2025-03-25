import { useEffect, useState } from 'react';
import {
  Outlet,
  createRootRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import GlobalStyles from '@/styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '@/styles/theme';
import Dialog from '@/components/common/dialog';
import { initializeAuth } from '@/utils/auth';
import useAuthStore from '@/store/store';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [authState, setAuthState] = useState({
    isInitialized: false,
    isAuthenticated: false,
  });
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    async function initAuth() {
      try {
        await initializeAuth();
        const { accessToken } = useAuthStore.getState();

        setAuthState({
          isInitialized: true,
          isAuthenticated: !!accessToken,
        });
      } catch {
        setAuthState({
          isInitialized: true,
          isAuthenticated: false,
        });
      }
    }

    initAuth();
  }, []);

  useEffect(() => {
    if (!authState.isInitialized) return;

    const { accessToken } = useAuthStore.getState();
    const publicRoutes = [
      '/auth/login',
      '/auth/sign-up/finish',
      '/auth/sign-in',
      '/auth/sign-up/sns',
    ];

    if (!accessToken && !publicRoutes.includes(location.pathname)) {
      navigate({ to: '/auth/login' });
    } else if (
      (location.pathname === '/' || location.pathname === '/auth/login') &&
      accessToken
    ) {
      navigate({ to: '/dashboard' });
    }
  }, [authState.isInitialized, location.pathname, navigate]);

  if (!authState.isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Dialog />
      <Outlet />
    </ThemeProvider>
  );
}
