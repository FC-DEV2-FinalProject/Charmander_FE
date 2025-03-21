import { create } from 'zustand';

type AuthState = {
  accessToken: string;
  // eslint-disable-next-line no-unused-vars
  setTokens: (newAccessToken: string) => void;
  clearTokens: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  accessToken: '',
  setTokens: (newAccessToken) => set({ accessToken: newAccessToken }),
  clearTokens: () => set({ accessToken: '' }),
}));

export default useAuthStore;
