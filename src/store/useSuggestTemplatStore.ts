import { create } from 'node_modules/zustand/esm/react.mjs';

interface StoreState {
  isSuggest: boolean;

  toggleIsSuggest: () => void;
}

const useSuggestTemplateStore = create<StoreState>((set) => ({
  isSuggest: false,
  toggleIsSuggest: () => set((state) => ({ isSuggest: !state.isSuggest })),
}));
export default useSuggestTemplateStore;
