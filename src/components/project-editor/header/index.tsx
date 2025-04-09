import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import theme from '@/styles/theme';
import BackIcon from '@/assets/projectIcon/back.svg?react';
import EditIcon from '@/assets/projectIcon/edit-2.svg?react';
import { Link, useLocation } from '@tanstack/react-router';
import { pdfjs } from 'react-pdf';
import Modal from '@/components/common/modal';
import EditModal from '../modal/editModal';
import { Route } from '@/routes/__root';
import { patchProjectTitle } from '@/api/project/api';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import { ScriptConFirmModal } from '../modal/scriptConFirmModal';
import useProjectData from '@/hook/useProjectData';
import usePDFExtractor from '@/hook/usePDFExtractor';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const ProjectHeader = () => {
  const location = useLocation();
  const { project } = Route.useParams();
  const { projectData, loading, error } = useProjectData(project);
  const { setProjectData } = useProjectEditorStore();
  const { handleFileUpload } = usePDFExtractor();

  const [projectTitle, setProjectTitle] = useState(
    projectData?.name || '새 프로젝트'
  );
  const [isEdit, setIsEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleArticleInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  useEffect(() => {
    if (projectData?.name) {
      setProjectTitle(projectData.name);
    }
  }, [projectData?.name]);

  const onChangeProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
    if (projectData) {
      setProjectData({
        id: projectData.id,
        name: e.target.value,
        scenes: projectData.scenes,
      });
    }
  };

  const handleSaveProjectTitle = async () => {
    if (isEdit) {
      try {
        if (projectData?.name) {
          await patchProjectTitle(project, projectData.name);

          setIsEdit(false);
        }
      } catch (err) {
        alert('제목 저장에 실패했습니다.');
        // eslint-disable-next-line no-console
        console.log(err);
        setProjectTitle(projectData?.name || '새 프로젝트');
      }
    } else {
      setIsEdit(true);
    }
  };

  if (loading) return <LoadingSpinner />;
  // eslint-disable-next-line no-console
  if (error) return console.log(error);

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
            <EditIcon onClick={handleSaveProjectTitle} />
          </S.TitleBox>
        </S.HeaderLeftContents>
        <S.ButtonBox>
          {location.pathname.endsWith('/article') ? (
            <>
              <S.ArticleUploadButton onClick={handleArticleInput}>
                기사 파일 업로드
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  ref={inputRef}
                />
              </S.ArticleUploadButton>
              <Link
                to="/$project/template"
                params={{ project: project }}>
                <S.HeaderButton>템플릿 직접 선택하기</S.HeaderButton>
              </Link>
              <Modal openText="템플릿 추천">
                {(setModalOpen) => (
                  <ScriptConFirmModal setModalOpen={setModalOpen} />
                )}
              </Modal>
            </>
          ) : (
            <Modal openText="제작하기">
              {(setModalOpen) => <EditModal setModalOpen={setModalOpen} />}
            </Modal>
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
    height: 80px;
    background-color: ${theme.colors.white};
    border-bottom: 1px solid ${theme.colors.border1};
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      cursor: pointer;
      margin-left: ${theme.spacing.sm};
    }
  `,
  HeaderLeftContents: styled.div`
    width: 60%;
    display: flex;
    align-items: center;
  `,
  TitleBox: styled.div`
    width: 40%;
    margin-left: 25%;
    display: flex;
    align-items: center;
  `,

  ProjectTitle: styled.input`
    width: 100%;
    background-color: ${theme.colors.white};
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
