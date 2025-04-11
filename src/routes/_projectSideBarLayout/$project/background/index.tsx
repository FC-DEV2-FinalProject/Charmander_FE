import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import DropDown from '@/components/common/dropdown';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import SidebarBackgroundStyleIcon from '@/assets/projectIcon/background-sidebarIcon.svg?react';
import BackgroundFileUploadIcon from '@/assets/projectIcon/backgroundFileUploadIcon.svg?react';
import DeleteBackgroundIcon from '@/assets/projectIcon/deleteBackground.svg?react';
import GenerateBackgroundIcon from '@/assets/projectIcon/generateBackground.svg?react';
import DragImage from '@/components/project-editor/dragImage';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import { useTemplates } from '@/hook/useTemplateList';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import { patchProjectBackgroundImage } from '@/api/project/api';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ImageUploadButton from '@/components/project-editor/imageUpload';
import { usePatchTemplate } from '@/hook/usePatchTemplate';
import { useTemplateSelector } from '@/hook/useTemplateSelector';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/background/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectData, updateBackground, resetBackground } =
    useProjectEditorStore();
  const { aspectRatio, setAspectRatio } = useAspectRatioStore();
  const { templatesQuery } = useTemplates();
  const { data: templateList, isLoading } = templatesQuery;
  const [templateImages, setTemplateImages] = useState(
    templateList?.data.map((template) => template.data.background) || []
  );
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateList?.data) {
      setTemplateImages(
        templateList.data.map((template) => template.data.background)
      );
    }
  }, [templateList?.data]);

  const savedBackgroundId = projectData?.scenes[0]?.background?.fileId;
  const { selectedIndex, setSelectedIndex, selectedTemplate } =
    useTemplateSelector({
      templates: templateImages,
      savedFileId: savedBackgroundId,
    });

  useEffect(() => {
    if (selectedTemplate) {
      updateBackground(selectedTemplate);
    }
  }, [selectedTemplate, updateBackground]);

  usePatchTemplate({
    selectedIndex,
    projectId: projectData?.id,
    sceneId: projectData?.scenes[0]?.id,
    templates: templateImages,
    patchFn: patchProjectBackgroundImage,
  });

  const handleTemplateImageClick = (idx: number) => {
    if (idx !== selectedIndex) {
      setSelectedIndex(idx);
    }
  };

  const handleRemoveBackground = () => {
    setSelectedIndex(-1);
    resetBackground();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <S.BackgroundContainer>
      <S.BackgroundMain>
        {selectedTemplate && (
          <DragImage
            aspectRatio={aspectRatio}
            imgSrc={selectedTemplate.fileUrl}
            imgAlt={selectedTemplate.name}
            containerRef={backgroundRef}
          />
        )}
      </S.BackgroundMain>

      <S.BackgroundToolbar>
        <DropDown
          dropDownData={['16:9(pc)', '9:16(mobile)']}
          width="90%"
          onSelect={(value) => setAspectRatio(value)}
        />
        <hr />
        <S.ImageUploadSection>
          <S.LabelSection>
            <BackgroundFileUploadIcon />
            <S.SidebarLabel>배경 업로드</S.SidebarLabel>
          </S.LabelSection>
          <ImageUploadButton
            templateImages={templateImages}
            setTemplateImages={setTemplateImages}
          />
        </S.ImageUploadSection>
        <hr />
        <S.TemplateSection>
          <S.LabelSection>
            <SidebarBackgroundStyleIcon />
            <S.SidebarLabel>배경 스타일</S.SidebarLabel>
          </S.LabelSection>

          <S.BackgroundTemplateList>
            {templateImages.map((template, idx) => (
              <S.BackgroundTemplateCard
                onClick={() => handleTemplateImageClick(idx)}
                key={template.id}>
                <S.BackgroundTemplateImg
                  isSelected={selectedTemplate?.id === template.id}
                  src={template.fileUrl}
                  alt={template.name}
                />
              </S.BackgroundTemplateCard>
            ))}
          </S.BackgroundTemplateList>

          <S.BackgroundButtonSection>
            <S.BackgroundButton onClick={() => handleRemoveBackground()}>
              <DeleteBackgroundIcon />
              배경 제거
            </S.BackgroundButton>

            <S.BackgroundButton>
              <GenerateBackgroundIcon />
              배경 생성
            </S.BackgroundButton>
          </S.BackgroundButtonSection>
        </S.TemplateSection>
      </S.BackgroundToolbar>
    </S.BackgroundContainer>
  );
}
const S = {
  BackgroundContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
  `,
  BackgroundMain: styled.div`
    background-color: ${theme.colors.white};
    width: 70%;
    height: calc(100vh - 180px);
    padding: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.xxlarge} 0 0 ${theme.radius.xxlarge};
  `,
  BackgroundToolbar: styled.div`
    background-color: ${theme.colors.white};
    width: 30%;
    height: calc(100vh - 180px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.xl};
    border: 1px solid ${theme.colors.border1};
    border-radius: 0 ${theme.radius.xxlarge} ${theme.radius.xxlarge} 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    hr {
      width: 90%;
      border: 1px solid ${theme.colors.border1};
    }
  `,
  ImageUploadSection: styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `,
  TemplateSection: styled.div`
    width: 90%;
    height: 500px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
  `,
  LabelSection: styled.div`
    display: flex;
    align-items: center;
  `,
  SidebarLabel: styled.label`
    margin-left: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  BackgroundTemplateList: styled.div`
    background-color: ${theme.colors.background2};
    border-radius: ${theme.radius.medium};
    width: 100%;
    height: 100%;
    max-height: 500px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 120px;
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  BackgroundTemplateCard: styled.div`
    width: 100%;
    height: 100%;
  `,
  BackgroundTemplateImg: styled.img<{ isSelected: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: ${(props) =>
      props.isSelected ? `2px solid ${theme.colors.secondary1}` : 'none'};
    box-sizing: border-box;
  `,
  BackgroundButtonSection: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: ${theme.spacing.md};
    :nth-child(2) {
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
    }
  `,
  BackgroundButton: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48%;
    border: 2px solid ${theme.colors.lightGray1};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.md};
  `,
};
