import useAuthStore from '@/store/store';

export const getTokens = () => {
  const { accessToken } = useAuthStore.getState();
  return { accessToken };
};

export const setTokens = (accessToken: string) => {
  useAuthStore.getState().setTokens(accessToken);
};

export const resetTokens = () => {
  useAuthStore.getState().clearTokens();
};
