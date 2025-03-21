import { create } from 'zustand';

type AuthState = {
  accessToken: string;
  refreshToken: string;
  // eslint-disable-next-line no-unused-vars
  setTokens: (newAccessToken: string, newRefreshToken: string) => void;
  clearTokens: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  accessToken: '',
  refreshToken: '',
  setTokens: (newAccessToken, newRefreshToken) =>
    set({ accessToken: newAccessToken, refreshToken: newRefreshToken }),
  clearTokens: () => set({ accessToken: '', refreshToken: '' }),
}));

export default useAuthStore;
