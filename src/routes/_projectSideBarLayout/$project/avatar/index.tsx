import { patchProjectAvatarImage } from '@/api/project/api';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import DragImage from '@/components/project-editor/dragImage';
import { usePatchTemplate } from '@/hook/usePatchTemplate';
import { useTemplates } from '@/hook/useTemplateList';
import { useTemplateSelector } from '@/hook/useTemplateSelector';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute('/_projectSideBarLayout/$project/avatar/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { projectData, updateAvatar } = useProjectEditorStore();
  const { aspectRatio } = useAspectRatioStore();
  const { templatesQuery } = useTemplates();
  const { data: templateList, isLoading } = templatesQuery;
  const [templateImages, setTemplateImages] = useState(
    templateList?.data.map((template) => template.data.avatar) || []
  );
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateList?.data) {
      setTemplateImages(
        templateList.data.map((template) => template.data.avatar)
      );
    }
  }, [templateList?.data]);

  const savedAvatarId = projectData?.scenes[0]?.avatar?.fileId;
  const { selectedIndex, setSelectedIndex, selectedTemplate } =
    useTemplateSelector({
      templates: templateImages,
      savedFileId: savedAvatarId,
    });

  useEffect(() => {
    if (selectedTemplate) {
      updateAvatar(selectedTemplate);
    }
  }, [selectedTemplate, updateAvatar]);

  usePatchTemplate({
    selectedIndex,
    projectId: projectData?.id,
    sceneId: projectData?.scenes[0]?.id,
    templates: templateImages,
    patchFn: patchProjectAvatarImage,
  });

  const handleAvatarTemplateClick = (idx: number) => {
    if (idx !== selectedIndex) {
      setSelectedIndex(idx);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <S.AvatarContainer>
      <S.AvatarMain>
        {selectedTemplate && (
          <DragImage
            aspectRatio={aspectRatio}
            imgSrc={selectedTemplate.fileUrl}
            imgAlt={selectedTemplate.name}
            containerRef={backgroundRef}
            isAvatar={true}
          />
        )}
      </S.AvatarMain>

      <S.AvatarToolbar>
        <S.TemplateSection>
          <S.LabelSection>
            <S.SidebarLabel>아바타 선택</S.SidebarLabel>
          </S.LabelSection>

          <S.AvatarTemplateList>
            {templateImages.map((template, idx) => (
              <S.AvatarTemplateCard
                onClick={() => handleAvatarTemplateClick(idx)}
                key={template.id}>
                <S.AvatarTemplateImg
                  isSelected={selectedTemplate?.id === template.id}
                  src={template.fileUrl}
                  autoPlay={true}
                  loop
                />
              </S.AvatarTemplateCard>
            ))}
          </S.AvatarTemplateList>
        </S.TemplateSection>
      </S.AvatarToolbar>
    </S.AvatarContainer>
  );
}

const S = {
  AvatarContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
  `,
  AvatarMain: styled.div`
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
  AvatarToolbar: styled.div`
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
  `,
  TemplateSection: styled.div`
    width: 90%;
    height: 100%;
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
  AvatarTemplateList: styled.div`
    width: 100%;
    max-height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  AvatarTemplateCard: styled.div`
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.background2};
    border-radius: ${theme.radius.medium};
  `,
  AvatarTemplateImg: styled.video<{ isSelected: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: ${(props) =>
      props.isSelected ? `2px solid ${theme.colors.secondary1}` : 'none'};
    box-sizing: border-box;
  `,
};
