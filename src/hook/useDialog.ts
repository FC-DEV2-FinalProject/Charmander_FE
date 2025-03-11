import useDialogStore from '@/store/useDialogStore';

export const useDialog = () => {
  const openAlert = useDialogStore((state) => state.openAlert);
  const openConfirm = useDialogStore((state) => state.openConfirm);

  const alert = (...messages: string[]) => {
    openAlert(messages);
  };

  const confirm = async (...messages: string[]) => {
    return await openConfirm(messages);
  };

  return { alert, confirm };
};
