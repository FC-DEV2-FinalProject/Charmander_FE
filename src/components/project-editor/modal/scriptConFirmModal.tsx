import styled from 'styled-components';
import theme from '@/styles/theme';
import { useRouter } from '@tanstack/react-router';
import { updateAndCleanupTranscripts } from '@/api/project/transcriptService';
import useArticlePDFStore from '@/store/useArticlePDFStore';
import { Route } from '@/routes/__root';

interface EditModalProps {
  // eslint-disable-next-line no-unused-vars
  setModalOpen: (open: boolean) => void;
}

export const ScriptConFirmModal = ({ setModalOpen }: EditModalProps) => {
  const { articlePDFText } = useArticlePDFStore();
  const router = useRouter();
  const { project } = Route.useParams();

  const submitArticle = async () => {
    try {
      await updateAndCleanupTranscripts(articlePDFText);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    router.navigate({ to: '/$project/background', params: { project } });
  };
  return (
    <S.EditModalContainer>
      <S.ExportMessageHead>템플릿 추천을 받으시겠습니까?</S.ExportMessageHead>
      <S.ExportMessage>
        기존에 작성된 대사는 삭제되며, 추천 받은 대사로 변경됩니다.
      </S.ExportMessage>
      <S.ButtonWrap>
        <S.CancelButton onClick={() => setModalOpen(false)}>
          취소
        </S.CancelButton>
        <S.ConfirmButton onClick={submitArticle}>추천</S.ConfirmButton>
      </S.ButtonWrap>
    </S.EditModalContainer>
  );
};

const S = {
  EditModalContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 500px;
    height: 100%;
    gap: ${theme.spacing.sm};
  `,
  ExportMessageHead: styled.div`
    font-size: ${theme.fontSizes.fz24};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.primary};
  `,
  ExportMessage: styled.div`
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.textSecond};
  `,
  ButtonWrap: styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: ${theme.fontSizes.fz16};
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
  `,
  CancelButton: styled.div`
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.border3};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    cursor: pointer;
  `,
  ConfirmButton: styled.div`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    cursor: pointer;
  `,
};
