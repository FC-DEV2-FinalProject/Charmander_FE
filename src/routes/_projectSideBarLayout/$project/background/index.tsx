import styled from 'styled-components';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DropDown from '@/components/common/dropdown';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import SidebarBackgroundStyleIcon from '@/assets/projectIcon/background-sidebarIcon.svg?react';
import BackgroundFileUploadIcon from '@/assets/projectIcon/backgroundFileUploadIcon.svg?react';
import ImageUploadIcon from '@/assets/projectIcon/imageUploadIcon.svg?react';
import DeleteBackgroundIcon from '@/assets/projectIcon/deleteBackground.svg?react';
import GenerateBackgroundIcon from '@/assets/projectIcon/generateBackground.svg?react';
import DragImage from '@/components/project-editor/dragImage';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import { nanoid } from 'nanoid';
import { useTemplates } from '@/hook/useTemplateList';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import { patchProjectBackgroundImage } from '@/api/project/api';
import { useDebounce } from '@/hook/useDebounce';
import { TemplateImage } from '@/types/template';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/background/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectData, updateBackground } = useProjectEditorStore();

  const { templatesQuery } = useTemplates();
  const { data: templateList, isLoading } = templatesQuery;
  const [selectedTemplateBgIndex, setSelectedTemplateBgIndex] = useState(-1);
  const debouncedTemplateBgIndex = useDebounce(selectedTemplateBgIndex, 1000);

  const { aspectRatio, setAspectRatio } = useAspectRatioStore();
  const [templateImages, setTemplateImages] = useState<TemplateImage[]>([]);

  const generateId = nanoid(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // 초기 템플릿 이미지 설정
  useEffect(() => {
    if (!templateList?.data) return;
    const backgrounds = templateList.data.map(
      (template) => template.data.background
    );
    setTemplateImages(backgrounds);
  }, [templateList?.data]);

  // 초기 선택된 배경 복원
  useEffect(() => {
    const backgroundFileId = projectData?.scenes[0]?.background?.fileId;

    if (!templateImages.length || !backgroundFileId) return;

    const savedIndex = templateImages.findIndex(
      (bg) => bg.fileUrl === backgroundFileId
    );

    if (savedIndex !== -1 && savedIndex !== selectedTemplateBgIndex) {
      setSelectedTemplateBgIndex(savedIndex);
    }
  }, [projectData?.scenes, templateImages, selectedTemplateBgIndex]);

  // 배경 업데이트
  useEffect(() => {
    if (
      selectedTemplateBgIndex === -1 ||
      !templateImages[selectedTemplateBgIndex]
    )
      return;
    updateBackground(templateImages[selectedTemplateBgIndex]);
  }, [selectedTemplateBgIndex, templateImages, updateBackground]);

  // 서버 업데이트 - 디바운스 적용
  useEffect(() => {
    if (
      !projectData?.id ||
      !projectData?.scenes[0]?.id ||
      debouncedTemplateBgIndex === undefined ||
      debouncedTemplateBgIndex === -1
    )
      return;

    const selectedTemplate = templateImages[debouncedTemplateBgIndex];
    if (!selectedTemplate) return;

    const upDateProjectImage = async () => {
      try {
        await patchProjectBackgroundImage(
          projectData.id,
          projectData.scenes[0].id,
          selectedTemplate
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`이미지 업로드에 실패했습니다: ${error}`);
      }
    };

    upDateProjectImage();
    const projectSceneId = projectData?.scenes?.[0]?.id;
    const projectId = projectData?.id;

    if (!projectId || !projectSceneId) return;
  }, [
    debouncedTemplateBgIndex,
    projectData?.id,
    projectData?.scenes,
    templateImages,
  ]);

  // selectedBackgroundTemplate 계산 로직 수정
  const selectedBackgroundTemplate = useMemo(() => {
    if (!templateImages || selectedTemplateBgIndex === -1) {
      return null;
    }
    return templateImages[selectedTemplateBgIndex];
  }, [templateImages, selectedTemplateBgIndex]);

  const handleBakcgroundTemplateImage = (idx: number) => {
    setSelectedTemplateBgIndex(idx);
  };

  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;

      const isDuplicate = templateImages.some(
        (template) => template.fileUrl === imageUrl
      );
      if (isDuplicate) {
        alert('이미 추가된 이미지입니다.');
        return;
      }

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const newTemplate: TemplateImage = {
          id: Number(generateId),
          name: 'New Background',
          priority: 0,
          fileUrl: imageUrl,
          size: { width: img.width, height: img.height },
          type: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setTemplateImages((prev) => [...prev, newTemplate]);
      };
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <div>로딩중</div>;
  }

  const isTemplabeBgSelected =
    selectedBackgroundTemplate && selectedBackgroundTemplate.fileUrl;

  return (
    <S.BackgroundContainer>
      <S.BackgroundMain>
        {isTemplabeBgSelected && (
          <DragImage
            aspectRatio={aspectRatio}
            imgSrc={selectedBackgroundTemplate.fileUrl}
            imgAlt={selectedBackgroundTemplate.name}
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
          <S.UploadButtonSection>
            <S.ImageUploadButton onClick={handleInput}>
              <ImageUploadIcon />
              이미지 업로드
              <input
                type="file"
                accept=".jpg,.png,.svg"
                ref={inputRef}
                onChange={handleFileUpload}
              />
            </S.ImageUploadButton>
          </S.UploadButtonSection>
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
                onClick={() => handleBakcgroundTemplateImage(idx)}
                key={template.id}>
                <S.BackgroundTemplateImg
                  isSelected={selectedBackgroundTemplate?.id === template.id}
                  src={template.fileUrl}
                  alt={template.name}
                />
              </S.BackgroundTemplateCard>
            ))}
          </S.BackgroundTemplateList>

          <S.BackgroundButtonSection>
            <S.BackgroundButton
              onClick={() => handleBakcgroundTemplateImage(-1)}>
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
  UploadButtonSection: styled.div`
    background-color: ${theme.colors.background2};
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.xlarge};
  `,
  ImageUploadButton: styled.button`
    display: flex;
    gap: ${theme.spacing.sm};
    background-color: ${theme.colors.white};
    border-radius: ${theme.radius.xlarge};
    padding: ${theme.spacing.md};
    box-shadow: ${theme.boxShadow.regular};
    input {
      display: none;
    }
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
