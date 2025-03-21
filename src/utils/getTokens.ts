import useAuthStore from '@/store/store';

export const getTokens = () => {
  const { accessToken, refreshToken } = useAuthStore.getState();
  return { accessToken, refreshToken };
};
