import theme from '@/styles/theme';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';
const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleButtonClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.files && target.files[0]) {
        const file = target.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            setSelectedImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);

        const base64Reader = new FileReader();
        base64Reader.onload = (event) => {
          if (event.target && event.target.result) {
            const base64String = (event.target.result as string).split(',')[1];
            setBase64Image(base64String);
          }
        };
        base64Reader.readAsDataURL(file);
      }
    };

    fileInput.click();
  };

  useEffect(() => {
    // eslint-disable-next-line no-empty
    if (base64Image) {
    }
  }, [base64Image]);

  return (
    <S.ImageUploadWrapper>
      <S.ImageContainer>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
          />
        ) : (
          <S.ProfileIcon>
            <FaUser size="45%" />
          </S.ProfileIcon>
        )}
      </S.ImageContainer>
      <S.ImageUploadButton onClick={handleButtonClick}>
        사진 업로드
      </S.ImageUploadButton>
    </S.ImageUploadWrapper>
  );
};

const S = {
  ImageUploadWrapper: styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    width: 50%;
    height: 90%;
    gap: 2rem;
  `,
  ImageContainer: styled.div`
    width: 10%;
    height: auto;
    aspect-ratio: 1/1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${theme.radius.medium};
    }
  `,
  ProfileIcon: styled.div`
    width: 50px;
    height: 50px;
    border-radius: ${({ theme }) => theme.radius.xsmall};
    background-color: ${({ theme }) => theme.colors.primary};
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.white};
  `,
  ImageUploadButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
    width: 20%;
    height: 5vh;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.fz16};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,
};

export default ImageUpload;
