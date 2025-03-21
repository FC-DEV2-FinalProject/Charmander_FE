import { create } from 'zustand';

interface StoreState {
  aspectRatio: string;
  // eslint-disable-next-line no-unused-vars
  setAspectRatio: (text: string) => void;
}

const useAspectRatioStore = create<StoreState>((set) => ({
  aspectRatio: '16:9(pc)',
  setAspectRatio: (text) => set({ aspectRatio: text }),
}));

export default useAspectRatioStore;
