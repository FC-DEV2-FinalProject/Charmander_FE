import styled from 'styled-components';
import VideoExportIcon from '@/assets/projectIcon/free-icon-video-production.svg?react';
import theme from '@/styles/theme';
import WarningEditModal from './warningModal';
import { useState } from 'react';

interface EditModalProps {
  // eslint-disable-next-line no-unused-vars
  setModalOpen: (open: boolean) => void;
}

const EditModal = ({ setModalOpen }: EditModalProps) => {
  const [isExporting, setIsExporting] = useState(false);
  return (
    <>
      {isExporting ? (
        <WarningEditModal setModalOpen={setModalOpen} />
      ) : (
        <S.EditModalContainer>
          <VideoExportIcon />
          <S.ExportMessageHead>
            영상 제작을 시작하시겠습니까?
          </S.ExportMessageHead>
          <S.ExportMessage>
            영상 제작은 약 5분 정도 소요되며, 보관함에서 확인 가능합니다.
          </S.ExportMessage>
          <S.ButtonWrap>
            <S.CancelButton onClick={() => setModalOpen(false)}>
              취소
            </S.CancelButton>
            <S.ConfirmButton onClick={() => setIsExporting(!isExporting)}>
              제작
            </S.ConfirmButton>
          </S.ButtonWrap>
        </S.EditModalContainer>
      )}
    </>
  );
};

export default EditModal;

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
