import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import theme from '@/styles/theme';
import BackIcon from '@/assets/projectIcon/back.svg?react';
import EditIcon from '@/assets/projectIcon/edit-2.svg?react';
import { Link, useLocation } from '@tanstack/react-router';
import useArticlePDFStore from '@/store/useArticlePDFStore';
import { pdfjs } from 'react-pdf';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const ProjectHeader = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [projectTitle, setProjectTitle] = useState('새 프로젝트');
  const { setArticlePDFText, clearArticlePDFText } = useArticlePDFStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onChangeProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }

    await extractTextFromPDF(file);
  };

  const extractTextFromPDF = async (file: File): Promise<void> => {
    clearArticlePDFText();
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      try {
        const loadingTask = pdfjs.getDocument(
          new Uint8Array(reader.result as ArrayBuffer)
        );
        const pdf = await loadingTask.promise;

        let extractedText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          extractedText +=
            textContent.items
              .map((item) => {
                if ('str' in item) {
                  return (item as TextItem).str;
                }
                return '';
              })
              .join(' ') + '\n';
        }

        setArticlePDFText(extractedText);
      } catch (error) {
        alert(error);
      }
    };
  };
  const location = useLocation();
  return (
    <>
      <S.HeaderContainer>
        <S.HeaderLeftContents>
          <Link to={'/dashboard'}>
            <BackIcon />
          </Link>
          <S.TitleBox>
            {isEdit ? (
              <S.ProjectTitle
                value={projectTitle}
                onChange={onChangeProjectTitle}
              />
            ) : (
              <S.ViewText onClick={() => setIsEdit(true)}>
                {projectTitle}
              </S.ViewText>
            )}
            <EditIcon
              color="black"
              onClick={() => setIsEdit(!isEdit)}
            />
          </S.TitleBox>
        </S.HeaderLeftContents>
        <S.ButtonBox>
          {location.pathname.endsWith('/article') ? (
            <>
              <S.ArticleUploadButton onClick={handleInput}>
                기사 파일 업로드
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  ref={inputRef}
                />
              </S.ArticleUploadButton>
              <S.HeaderButton>템플릿 추천</S.HeaderButton>
              <Link
                to="/$project/avatar"
                params={{ project: '1' }}>
                <S.HeaderButton>템플릿 없이 진행하기</S.HeaderButton>
              </Link>
            </>
          ) : (
            <S.ExportButton>제작하기</S.ExportButton>
          )}
        </S.ButtonBox>
      </S.HeaderContainer>
    </>
  );
};

export default ProjectHeader;

const S = {
  HeaderContainer: styled.div`
    width: 100%;
    height: 60px;
    background-color: ${theme.colors.white};
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      cursor: pointer;
      margin-left: ${theme.spacing.sm};
    }
  `,
  HeaderLeftContents: styled.div`
    display: flex;
    align-items: center;
  `,
  TitleBox: styled.div`
    width: 100%;
    margin-left: 270px;
    display: flex;
    align-items: center;
  `,

  ProjectTitle: styled.input`
    width: 100%;
    background-color: theme.colors.white;
    color: theme.colors.black;
    font-size: ${theme.fontSizes.fz30};
  `,
  ViewText: styled.span`
    font-size: ${theme.fontSizes.fz30};
  `,
  ButtonBox: styled.div`
    display: flex;
    align-items: center;
  `,

  HeaderButton: styled.button`
    background-color: ${theme.colors.primaryOpacity};
    margin-right: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeights.bold};
  `,
  ExportButton: styled.button`
    background-color: ${theme.colors.primary};
    margin-right: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.white};
    font-weight: ${theme.fontWeights.bold};
  `,
  ArticleUploadButton: styled.button`
    background-color: ${theme.colors.primaryOpacity};
    margin-right: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeights.bold};
    input {
      display: none;
    }
  `,
};
