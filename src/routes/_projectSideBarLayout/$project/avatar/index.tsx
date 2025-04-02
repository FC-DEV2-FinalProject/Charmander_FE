import { patchProjectAvatarImage } from '@/api/project/api';
import DragImage from '@/components/project-editor/dragImage';
import { useDebounce } from '@/hook/useDebounce';
import { useTemplates } from '@/hook/useTemplateList';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute('/_projectSideBarLayout/$project/avatar/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { projectData, updateAvatar } = useProjectEditorStore();
  const { aspectRatio } = useAspectRatioStore();
  const [selectedAvatarTemplateIndex, setSelectedAvatarTemplateIndex] =
    useState(-1);
  const { templatesQuery } = useTemplates();
  const { data: templateList, isLoading } = templatesQuery;
  const backgroundRef = useRef<HTMLDivElement>(null);
  const debouncedAvatarIndex = useDebounce(selectedAvatarTemplateIndex, 1000);

  // 초기 선택된 아바타 복원
  useEffect(() => {
    const avatarFileId = projectData?.scenes?.[0]?.avatar?.fileId;

    if (!templateList?.data || !avatarFileId) return;

    const savedIndex = templateList.data.findIndex(
      (template) => template.data.avatar.fileUrl === avatarFileId
    );

    if (savedIndex !== -1 && savedIndex !== selectedAvatarTemplateIndex) {
      setSelectedAvatarTemplateIndex(savedIndex);
    }
  }, [projectData?.scenes, templateList?.data, selectedAvatarTemplateIndex]);

  // 아바타 업데이트
  useEffect(() => {
    if (selectedAvatarTemplateIndex === -1) return;

    const selectedTemplate = templateList?.data[selectedAvatarTemplateIndex];
    if (!selectedTemplate) return;

    updateAvatar(selectedTemplate.data.avatar);
  }, [selectedAvatarTemplateIndex, templateList?.data, updateAvatar]);

  // 서버 업데이트 - 디바운스 적용
  useEffect(() => {
    if (
      !projectData?.id ||
      !debouncedAvatarIndex ||
      debouncedAvatarIndex === -1
    )
      return;
    if (!templateList?.data[debouncedAvatarIndex]) return;

    const sceneId = projectData.scenes?.[0]?.id;

    const updateProjectImage = async () => {
      try {
        await patchProjectAvatarImage(
          projectData.id,
          sceneId,
          templateList.data[debouncedAvatarIndex].data.avatar
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`아바타 업데이트에 실패했습니다: ${error}`);
      }
    };

    updateProjectImage();
  }, [
    debouncedAvatarIndex,
    projectData?.id,
    projectData?.scenes,
    templateList?.data,
  ]);

  // 선택된 아바타 템플릿 메모이제이션
  const selectedAvatarTemplate = useMemo(() => {
    if (!templateList?.data || selectedAvatarTemplateIndex === -1) {
      return null;
    }
    return templateList.data[selectedAvatarTemplateIndex].data.avatar;
  }, [templateList?.data, selectedAvatarTemplateIndex]);

  const handleAvatarTemplateImage = (idx: number) => {
    setSelectedAvatarTemplateIndex(idx);
  };

  if (isLoading) {
    return <div>로딩중 </div>;
  }

  return (
    <S.AvatarContainer>
      <S.AvatarMain>
        {selectedAvatarTemplate && (
          <DragImage
            aspectRatio={aspectRatio}
            imgSrc={selectedAvatarTemplate.fileUrl}
            imgAlt={selectedAvatarTemplate.name}
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
            {templateList?.data.map((template, idx) => (
              <S.AvatarTemplateCard
                onClick={() => handleAvatarTemplateImage(idx)}
                key={template.data.avatar.id}>
                <S.AvatarTemplateImg
                  isSelected={
                    selectedAvatarTemplate?.id === template.data.avatar.id
                  }
                  src={template.data.avatar.fileUrl}
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
