import { useRef, useMemo, useEffect, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import theme from '@/styles/theme';
import useProjectEditorStore from '@/store/useProjectEditorStore';

function VideoViewPortComponent({ aspectRatio }: { aspectRatio: string }) {
  const { projectData } = useProjectEditorStore();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const background = projectData?.scenes?.[0]?.background;
  const avatar = projectData?.scenes?.[0]?.avatar;
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
    if (
      !containerSize.width ||
      !containerSize.height ||
      !background ||
      !avatar
    ) {
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
        backgroundWidth: `${containerSize.width}px`,
        backgroundHeight: `${containerSize.height}px`,
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

  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => {
      if (viewportRef.current) {
        const { width, height } = viewportRef.current.getBoundingClientRect();
        setViewportSize({ width, height });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!background && !avatar) {
    return (
      <S.VideoVeiwPort
        ref={viewportRef}
        aspectRatio={aspectRatio}
      />
    );
  }

  return (
    <S.VideoVeiwPort
      ref={viewportRef}
      aspectRatio={aspectRatio}>
      <S.VideoContainer
        width={viewportSize.width}
        height={viewportSize.height}>
        {background && (
          <S.SelectedBackgroundImage
            aspectRatio={aspectRatio}
            src={background.fileUrl}
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
            aspectRatio={aspectRatio}
            src={avatar.fileUrl}
            autoPlay
            style={{
              transform: avatarTransform,
              width: avatarWidth,
              height: avatarHeight,
            }}
          />
        )}
      </S.VideoContainer>
    </S.VideoVeiwPort>
  );
}

const S = {
  VideoVeiwPort: styled.div<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    position: relative;
    border: 2px solid ${theme.colors.secondary1};
    overflow: hidden;
  `,
  VideoContainer: styled.div<{ width: number; height: number }>`
    position: relative;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
  `,
  SelectedBackgroundImage: styled.img<{ aspectRatio: string }>`
    position: absolute;
    object-fit:;
  `,
  SelectedAvatarImage: styled.video<{ aspectRatio: string }>`
    position: absolute;
    object-fit: contain;
    z-index: 1;
  `,
};

export default VideoViewPortComponent;
