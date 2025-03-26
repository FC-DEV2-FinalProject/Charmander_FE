import api from '@/api/login/api';
import useAuthStore from '@/store/store';

export const initializeAuth = async () => {
  try {
    const response = await api.post('/api/v1/auth/refresh');
    const { accessToken } = response.data;
    useAuthStore.getState().setTokens(accessToken);
  } catch {
    throw new Error(`세션이 유효하지 않습니다.`);
  }
};
