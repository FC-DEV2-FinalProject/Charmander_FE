import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  isConfirm: boolean;
  messages: string[];
  onConfirm: () => void;
  onCancel: () => void;

  /* eslint-disable no-unused-vars */

  openAlert: (messages: string[]) => void;
  openConfirm: (messages: string[]) => Promise<boolean>;
  closeDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  isConfirm: false,
  messages: [],
  onConfirm: () => {},
  onCancel: () => {},

  openAlert: (messages: string[]) => {
    set({ isOpen: true, isConfirm: false, messages: messages });
  },

  openConfirm: (messages: string[]) => {
    return new Promise((resolve) => {
      set({
        isOpen: true,
        isConfirm: true,
        messages: messages,
        onConfirm: () => {
          resolve(true);
          set({ isOpen: false });
        },
        onCancel: () => {
          resolve(false);
          set({ isOpen: false });
        },
      });
    });
  },

  closeDialog: () =>
    set({
      isOpen: false,
      messages: [],
      onConfirm: () => {},
      onCancel: () => {},
    }),
}));

export default useDialogStore;
