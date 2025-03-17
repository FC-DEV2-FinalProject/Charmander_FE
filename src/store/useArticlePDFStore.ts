import { create } from 'zustand';

interface StoreState {
  articlePDFText: string;
  // eslint-disable-next-line no-unused-vars
  setArticlePDFText: (text: string) => void;
  clearArticlePDFText: () => void;
}

const useArticlePDFStore = create<StoreState>((set) => ({
  articlePDFText: '',
  setArticlePDFText: (text) => set({ articlePDFText: text }),
  clearArticlePDFText: () => set({ articlePDFText: '' }),
}));

export default useArticlePDFStore;
