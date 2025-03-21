import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/callback/google/')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processGoogleLogin = async () => {
      try {
        // URL에서 인증 코드 추출
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (!code) {
          setError('인증 코드가 없습니다.');
          setLoading(false);
          return;
        }

        const response = await axios.post('/api/auth/google', { code });

        localStorage.setItem('userProfile', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);

        navigate({ to: '/auth/sign-in' });
      } catch {
        setError('로그인 처리 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    processGoogleLogin();
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <p>로그인 처리 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate({ to: '/auth/sign-in' })}>
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return null;
}
