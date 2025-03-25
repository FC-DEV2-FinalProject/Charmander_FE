import { useState, useEffect } from 'react';
import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import axios from 'node_modules/axios';
import { setTokens } from '@/utils/Tokens';

export const Route = createFileRoute('/auth/callback/kakao/')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processKakaoLogin = async () => {
      try {
        // URL에서 인증 코드 추출
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (!code) {
          setError('인증 코드가 없습니다.');
          setLoading(false);
          return;
        }

        const response = await axios.post(import.meta.env.VITE_OAUTH_API_URL, {
          provider: 'kakao',
          code: code,
        });

        if (response.data) {
          const { accessToken } = response.data;
          setTokens(accessToken);
          //console.log(accessToken);
        }

        navigate({ to: '/auth/sign-up/sns' });
      } catch {
        setError('로그인 처리 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    processKakaoLogin();
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
        <button onClick={() => navigate({ to: '/auth/login' })}>
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return null;
}
