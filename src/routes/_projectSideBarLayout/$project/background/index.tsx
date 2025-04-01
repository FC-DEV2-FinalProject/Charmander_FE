import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
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
  const { projectData, updateBackground, resetBackground } =
    useProjectEditorStore();
  const { templatesQuery } = useTemplates();
  const { data: templateList, isLoading } = templatesQuery;
  const { aspectRatio, setAspectRatio } = useAspectRatioStore();
  const [selectedBackgroundTemplate, setSelectedBackgroundTemplate] =
    useState<TemplateImage | null>(projectData?.scenes[0].background || null);
  const [templateImages, setTemplateImages] = useState<TemplateImage[]>([]);

  const media = projectData?.scenes[0]?.background;
  const debouncedBackground = useDebounce(media, 1000);
  const generateId = nanoid(10);

  const inputRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (templateList) {
      setTemplateImages((prevBackgrounds) => {
        const newBackgrounds = templateList.data
          .map((template) => template.data.background)
          .filter((bg) => bg && !prevBackgrounds.includes(bg));

        return [...prevBackgrounds, ...newBackgrounds];
      });
    }
  }, [templateList]);

  useEffect(() => {
    if (selectedBackgroundTemplate) {
      updateBackground(selectedBackgroundTemplate);
    }
  }, [selectedBackgroundTemplate, updateBackground]);

  useEffect(() => {
    if (!debouncedBackground || !projectData) return;

    const currentBackground = projectData.scenes[0].background;

    if (currentBackground && currentBackground === debouncedBackground) {
      return;
    }

    const upDateProjectImage = async () => {
      try {
        await patchProjectBackgroundImage(
          projectData.id,
          projectData.scenes[0].id,
          debouncedBackground
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`이미지 업로드에 실패했습니다${error}`);
      }
    };

    upDateProjectImage();
  }, [projectData, debouncedBackground]);

  const handleBakcgroundTemplateImage = (template: TemplateImage | null) => {
    if (template) {
      setSelectedBackgroundTemplate(template);
      updateBackground(template);
    } else {
      setSelectedBackgroundTemplate(null);
      resetBackground();
    }
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
  return (
    <S.BackgroundContainer>
      <S.BackgroundMain>
        {selectedBackgroundTemplate && selectedBackgroundTemplate.fileUrl && (
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
            {templateImages.map((template) => (
              <S.BackgroundTemplateCard
                onClick={() => handleBakcgroundTemplateImage(template)}
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
              onClick={() => handleBakcgroundTemplateImage(null)}>
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
