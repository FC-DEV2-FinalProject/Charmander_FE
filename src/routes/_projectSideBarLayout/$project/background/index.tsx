import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import DropDown from '@/components/common/dropdown';
import theme from '@/styles/theme';
import { mockTemplateImage, Template } from '@/mock/mockTemplateImage';
import { createFileRoute } from '@tanstack/react-router';
import SidebarBackgroundStyleIcon from '@/assets/projectIcon/background-sidebarIcon.svg?react';
import BackgroundFileUploadIcon from '@/assets/projectIcon/backgroundFileUploadIcon.svg?react';
import ImageUploadIcon from '@/assets/projectIcon/imageUploadIcon.svg?react';
import DeleteBackgroundIcon from '@/assets/projectIcon/deleteBackground.svg?react';
import GenerateBackgroundIcon from '@/assets/projectIcon/generateBackground.svg?react';
import DragImage from '@/components/project-editor/dragImage';
import useAspectRatioStore from '@/store/useAspectRatioStore';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/background/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { aspectRatio, setAspectRatio } = useAspectRatioStore();
  const [SelectedBackgroundTemplate, setSelectedBackgroundTemplate] =
    useState<Template | null>(null);
  const [templateImages, setTemplateImages] = useState<Template[]>(
    mockTemplateImage().templates
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

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
        (template) => template.url === imageUrl
      );
      if (isDuplicate) {
        alert('이미 추가된 이미지입니다.');
        return;
      }

      const newTemplate: Template = {
        id: String(Date.now()),
        type: '',
        url: imageUrl,
        position: {
          x: 0,
          y: 0,
        },
      };

      setTemplateImages((prev) => [...prev, newTemplate]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <S.BackgroundContainer>
      <S.BackgroundMain>
        {SelectedBackgroundTemplate && (
          <DragImage
            aspectRatio={aspectRatio}
            src={SelectedBackgroundTemplate.url}
            alt={SelectedBackgroundTemplate.url}
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
                onClick={() => setSelectedBackgroundTemplate(template)}
                key={template.id}>
                <S.BackgroundTemplateImg
                  isSelected={SelectedBackgroundTemplate?.id === template.id}
                  src={template.url}
                  alt={template.url}
                />
              </S.BackgroundTemplateCard>
            ))}
          </S.BackgroundTemplateList>

          <S.BackgroundButtonSection>
            <S.BackgroundButton
              onClick={() => setSelectedBackgroundTemplate(null)}>
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
