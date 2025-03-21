import useAuthStore from '@/store/store';
import api from './api';

export const refreshAccessToken = async () => {
  try {
    const response = await api.post('/api/v1/auth/refresh');
    const { accessToken } = response.data;

    useAuthStore.getState().setTokens(accessToken);
    return accessToken;
  } catch {
    return null;
  }
};
