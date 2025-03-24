import styled from 'styled-components';
import WarningIcon from '@/assets/projectIcon/alert-triangle.svg?react';
import theme from '@/styles/theme';

interface EditModalProps {
  // eslint-disable-next-line no-unused-vars
  setModalOpen: (open: boolean) => void;
}

const WarningEditModal = ({ setModalOpen }: EditModalProps) => {
  const isExporting = true;
  return (
    <S.EditModalContainer>
      <WarningIcon />
      <S.ExportMessageHead>
        {isExporting
          ? '기존에 제작 중인 영상이 있습니다.'
          : '해당 프로젝트로 제작 된 동일한 영상이 존재합니다.'}
      </S.ExportMessageHead>
      <S.ExportMessageHead>
        {isExporting
          ? '영상 제작 완료 후 시도해주세요.'
          : '수정 후 영상을 생성 해주세요.'}
      </S.ExportMessageHead>

      <S.ButtonWrap>
        <S.ConfirmButton onClick={() => setModalOpen(false)}>
          확인
        </S.ConfirmButton>
      </S.ButtonWrap>
    </S.EditModalContainer>
  );
};

export default WarningEditModal;

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
