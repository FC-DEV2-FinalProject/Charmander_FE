import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import DropDown from '@/components/common/dropdown';
import theme from '@/styles/theme';
import { mockTemplateImage, Template } from '@/mock/mockTemplateImage';
import { createFileRoute } from '@tanstack/react-router';
import SidebarBackgroundStyleIcon from '@/assets/projectIcon/background-sidebarIcon.svg?react';
import BackgroundFileUploadIcon from '@/assets/projectIcon/backgroundFileUploadIcon.svg?react';
import ImageUploadIcon from '@/assets/projectIcon/imageUploadIcon.svg?react';
import AspectRatioIcon from '@/assets/projectIcon/Frame.svg?react';
import DeleteBackgroundIcon from '@/assets/projectIcon/deleteBackground.svg?react';
import GenerateBackgroundIcon from '@/assets/projectIcon/generateBackground.svg?react';
import DragImage from '@/components/project-editor/dragImage';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/background/'
)({
  component: RouteComponent,
});
interface ImageSize {
  width?: string | string;
  height?: string | string;
}

function RouteComponent() {
  const [SelectedBackgroundTemplate, setSelectedBackgroundTemplate] =
    useState<Template | null>(null);
  const [selectAspectRatio, setSelectAspectRatio] = useState('16:9(pc)');
  const [imageSize, setImageSize] = useState<ImageSize | null>(null);
  const [templateImages, setTemplateImages] =
    useState<Template[]>(mockTemplateImage());

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
        (template) => template.imageUrl === imageUrl
      );
      if (isDuplicate) {
        alert('이미 추가된 이미지입니다.');
        return;
      }

      const newTemplate: Template = {
        id: String(Date.now()),
        name: file.name,
        imageUrl: imageUrl,
      };

      setTemplateImages((prev) => [...prev, newTemplate]);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSize = (key: 'width' | 'height', value: string) => {
    if (!/^\d*$/.test(value)) {
      alert('숫자만 입력 가능합니다.');
      return;
    }

    const numericValue = Number(value);

    if (numericValue > 1920) {
      alert('최대 입력 가능한 값은 1920입니다.');
      return;
    }

    setImageSize((prev) => ({
      ...prev,
      [key]: numericValue.toString(), // 문자열로 저장 (입력 필드 유지)
    }));
  };
  return (
    <S.BackgroundContainer>
      <S.BackgroundMain>
        {SelectedBackgroundTemplate && (
          <DragImage
            aspectRatio={selectAspectRatio}
            src={SelectedBackgroundTemplate.imageUrl}
            alt={SelectedBackgroundTemplate.name}
            size={{
              width: imageSize?.width || null,
              height: imageSize?.height || null,
            }}
            containerRef={backgroundRef}
          />
        )}
      </S.BackgroundMain>

      <S.BackgroundToolbar>
        <DropDown
          placeholder="화면 비율 선택"
          dropDownData={['16:9(pc)', '9:16(mobile)']}
          width="90%"
          onSelect={(value) => setSelectAspectRatio(value)}
        />
        <S.AspectRatioControlSection>
          <S.LabelSection>
            <AspectRatioIcon />
            <S.SidebarLabel>직접 입력</S.SidebarLabel>
          </S.LabelSection>
          <S.EnterAspectRatioData>
            <S.AspectRatioInput
              value={imageSize?.width || ''}
              onChange={(e) => handleImageSize('width', e.target.value)}
            />
            <S.AspectRatioInput
              value={imageSize?.height || ''}
              onChange={(e) => handleImageSize('height', e.target.value)}
            />
            px
          </S.EnterAspectRatioData>
        </S.AspectRatioControlSection>
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
                  src={template.imageUrl}
                  alt={template.name}
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
  `,
  AspectRatioControlSection: styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: ${theme.spacing.md};
  `,
  EnterAspectRatioData: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: ${theme.spacing.xs};
    color: ${theme.colors.primary}
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  AspectRatioInput: styled.input`
    width: 45%;
    height: 55px;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${theme.radius.small};
    font-size: ${theme.fontSizes.fz20};
    text-align: center;
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
    color: ${theme.colors.darkGray2};
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  BackgroundTemplateList: styled.div`
    background-color: ${theme.colors.background2};
    border-radius: ${theme.radius.medium};
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  BackgroundTemplateCard: styled.div`
    width: 30%;
    height: 30%;
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
