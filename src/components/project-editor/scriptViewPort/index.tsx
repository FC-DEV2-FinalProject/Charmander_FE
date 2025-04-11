import useProjectEditorStore from '@/store/useProjectEditorStore';
import styled from 'styled-components';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import theme from '@/styles/theme';

function VideoViewPortComponent({ aspectRatio }: { aspectRatio: string }) {
  const { projectData } = useProjectEditorStore();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const background = projectData?.scenes?.[0]?.background;
  const avatar = projectData?.scenes?.[0]?.avatar;
  const subtitleStyle = projectData?.scenes[0].subtitle;
  const viewportRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const updateContainerSize = () => {
      if (viewportRef.current) {
        const { width, height } = viewportRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  const {
    transform,
    backgroundWidth,
    backgroundHeight,
    avatarTransform,
    avatarWidth,
    avatarHeight,
  } = useMemo(() => {
    if (!containerSize.width || !containerSize.height) {
      return {
        transform: '',
        backgroundWidth: '100%',
        backgroundHeight: '100%',
        avatarTransform: '',
        avatarWidth: '100%',
        avatarHeight: '100%',
      };
    }

    if (!background || !background.position || !background.size) {
      return {
        transform: '',
        backgroundWidth: '100%',
        backgroundHeight: '100%',
        avatarTransform: '',
        avatarWidth: '100%',
        avatarHeight: '100%',
      };
    }

    if (!avatar || !avatar.position || !avatar.size) {
      return {
        transform: '',
        backgroundWidth: '100%',
        backgroundHeight: '100%',
        avatarTransform: '',
        avatarWidth: '100%',
        avatarHeight: '100%',
      };
    }

    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;

    const posXPercent = (background.position.x / 1920) * 100;
    const posYPercent = (background.position.y / 1080) * 100;
    const widthPercent = (background.size.width / 1920) * 100;
    const heightPercent = (background.size.height / 1080) * 100;

    const avatarPosXPercent = (avatar.position.x / 1920) * 100;
    const avatarPosYPercent = (avatar.position.y / 1080) * 100;
    const avatarWidthPercent = (avatar.size.width / 1920) * 100;
    const avatarHeightPercent = (avatar.size.height / 1080) * 100;

    const translateX = (posXPercent / 100) * containerWidth;
    const translateY = (posYPercent / 100) * containerHeight;
    const renderWidth = (widthPercent / 100) * containerWidth;
    const renderHeight = (heightPercent / 100) * containerHeight;

    const avatarTranslateX = (avatarPosXPercent / 100) * containerWidth;
    const avatarTranslateY = (avatarPosYPercent / 100) * containerHeight;
    const avatarRenderWidth = (avatarWidthPercent / 100) * containerWidth;
    const avatarRenderHeight = (avatarHeightPercent / 100) * containerHeight;

    return {
      transform: `translate(${translateX}px, ${translateY}px)`,
      backgroundWidth: `${renderWidth}px`,
      backgroundHeight: `${renderHeight}px`,
      avatarTransform: `translate(${avatarTranslateX}px, ${avatarTranslateY}px)`,
      avatarWidth: `${avatarRenderWidth}px`,
      avatarHeight: `${avatarRenderHeight}px`,
    };
  }, [containerSize, background, avatar]);

  if (!background && !avatar) {
    return (
      <S.VideoViewPort
        ref={viewportRef}
        aspectRatio={aspectRatio}
      />
    );
  }

  return (
    <S.VideoViewPort
      ref={viewportRef}
      aspectRatio={aspectRatio}>
      <S.VideoContainer>
        {background && (
          <S.SelectedBackgroundImage
            src={background.fileId}
            alt={background.name}
            style={{
              transform,
              width: backgroundWidth,
              height: backgroundHeight,
            }}
          />
        )}
        {avatar && (
          <S.SelectedAvatarImage
            src={avatar.fileId}
            autoPlay
            loop
            style={{
              transform: avatarTransform,
              width: avatarWidth,
              height: avatarHeight,
            }}
          />
        )}
        {subtitleStyle && (
          <S.SubtitleContainer>
            <S.SubtitleText
              font={subtitleStyle.property.fontFamily}
              weight={subtitleStyle.property.fontWeight}
              size={subtitleStyle.property.fontSize}
              color={subtitleStyle.property.fontColor}
              backgroundStyle={subtitleStyle.property.backgroundStyle}>
              {projectData?.scenes?.[0]?.transcripts?.[0]?.text || ''}
            </S.SubtitleText>
          </S.SubtitleContainer>
        )}
      </S.VideoContainer>
    </S.VideoViewPort>
  );
}

const S = {
  VideoViewPort: styled.div<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    position: relative;
    border: 2px solid ${theme.colors.secondary1};
    overflow: hidden;
  `,
  VideoContainer: styled.div`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  SelectedBackgroundImage: styled.img`
    position: absolute;
    object-fit: cover;
  `,
  SelectedAvatarImage: styled.video`
    position: absolute;
    object-fit: contain;
    z-index: 1;
  `,
  SubtitleContainer: styled.div`
    position: absolute;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
  `,
  SubtitleText: styled.span<{
    font: string;
    weight: string;
    size: number;
    color: string;
    backgroundStyle: string;
  }>`
    width: ${(props) => (props.backgroundStyle === 'long' ? '80%' : '')};
    font-family: ${(props) => props.font};
    font-weight: ${(props) =>
      props.weight === '얇게'
        ? `${theme.fontWeights.light}`
        : props.weight === '중간'
          ? `${theme.fontWeights.medium}`
          : `${theme.fontWeights.bold}`};
    font-size: ${(props) => props.size}px;
    color: ${(props) => props.color};
    background-color: ${(props) =>
      props.backgroundStyle !== 'transparent'
        ? theme.colors.primary
        : 'transparent'};
    padding: 5px 10px;
    border-radius: ${theme.radius.small};
    text-align: center;
  `,
};

export default VideoViewPortComponent;
