import styled from 'styled-components';
import theme from '@/styles/theme';
import ImageUploadIcon from '@/assets/projectIcon/imageUploadIcon.svg?react';
import React, { useRef } from 'react';
import { nanoid } from 'nanoid';
import { TemplateImage } from '@/types/template';

const ImageUploadButton = ({
  templateImages,
  setTemplateImages,
}: {
  templateImages: TemplateImage[];
  setTemplateImages: React.Dispatch<React.SetStateAction<TemplateImage[]>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generateId = nanoid(10);

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

  return (
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
  );
};

export default ImageUploadButton;

const S = {
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
};
