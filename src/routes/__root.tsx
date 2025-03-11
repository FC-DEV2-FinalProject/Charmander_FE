import { useEffect } from 'react';
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

// 임시 로그인 상태
const isAuthenticated = false;

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const { location } = useRouterState();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate({ to: isAuthenticated ? '/dashboard' : '/auth/login' });
    }
  }, [location.pathname, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Dialog />
      <Outlet />
    </ThemeProvider>
  );
}
