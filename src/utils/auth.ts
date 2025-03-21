import useAuthStore from '@/store/store';

export const initializeAuth = async () => {
  const response = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `세션이 유효하지 않습니다. 오류 메시지: ${errorData.message || '알 수 없는 오류'}`
    );
  }

  const { accessToken } = await response.json();
  useAuthStore.getState().setTokens(accessToken);
};
