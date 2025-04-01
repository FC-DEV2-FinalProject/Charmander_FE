import styled from 'styled-components';
import DeleteIcon from '@/assets/projectIcon/deleteIcon.svg?react';
import theme from '@/styles/theme';

interface ScriptSectionProps {
  id: number;
  text: string;

  // eslint-disable-next-line no-unused-vars
  onDelete: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleSubTitle: (id: number, field: 'text', value: string) => void;
  onSelect: () => void;
  isSelected: boolean;
}

const ScriptSection = ({
  id,
  text,
  onDelete,
  handleSubTitle,
  onSelect,
  isSelected,
}: ScriptSectionProps) => {
  return (
    <S.Container
      isSelected={isSelected}
      onClick={onSelect}>
      <S.Header>
        <S.TranscriptText
          onChange={(e) => handleSubTitle(id, 'text', e.target.value)}
          value={text}
        />

        <S.DeleteButton onClick={() => onDelete(id)}>
          <DeleteIcon />
        </S.DeleteButton>
      </S.Header>
    </S.Container>
  );
};

export default ScriptSection;

const S = {
  Container: styled.div<{ isSelected: boolean }>`
    background-color: ${theme.colors.white};
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.medium};
    margin-bottom: ${theme.spacing.sm};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    position: relative;
  `,

  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,

  TranscriptText: styled.input`
    width: 80%;
    font-weight: ${theme.fontWeights.medium};
    color: ${theme.colors.black};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.radius.small};
    max-width: 80%;
  `,

  DeleteButton: styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.medium};
    cursor: pointer;
    padding: ${theme.spacing.md};
    margin-left: ${theme.spacing.sm};
  `,
};
