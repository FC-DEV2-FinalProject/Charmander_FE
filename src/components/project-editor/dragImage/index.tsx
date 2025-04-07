import styled from 'styled-components';
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  useMemo,
} from 'react';
import theme from '@/styles/theme';
import { useDebounce } from '@/hook/useDebounce';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import { Position } from '@/types/projectData';

interface ImageProps {
  aspectRatio: string;
  imgSrc: string;
  imgAlt: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isAvatar?: boolean;
}

interface Dimensions {
  width: number;
  height: number;
}

const percentToPxForFinal = (percent: number, finalDimension: number): number =>
  (percent / 100) * finalDimension;

function DragImage({
  aspectRatio,
  imgSrc,
  imgAlt,
  containerRef,
  isAvatar,
}: ImageProps) {
  const { projectData, updateElementPosition, updateElementSize } =
    useProjectEditorStore();

  const referenceDimensions = useMemo(
    () =>
      aspectRatio === '16:9(pc)'
        ? { width: 1920, height: 1080 }
        : { width: 1080, height: 1920 },
    [aspectRatio]
  );

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 100,
    height: 100,
  });
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [initialSize, setInitialSize] = useState<Dimensions>({
    width: 100,
    height: 100,
  });
  const [initialPos, setInitialPos] = useState<Position>({ x: 0, y: 0 });
  const [startMousePos, setStartMousePos] = useState<Position>({ x: 0, y: 0 });

  const resizeDirection = useRef<string | null>(null);

  const debouncedPosition = useDebounce(position, 1000);
  const debouncedDimensions = useDebounce(dimensions, 1000);

  useLayoutEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      if (!isAvatar) {
        setDimensions({ width: 100, height: 100 });
      } else {
        const widthPercent = (container.width / container.width) * 100;
        const heightPercent = (container.height / container.height) * 100;
        setDimensions({ width: widthPercent, height: heightPercent });
      }
    }
  }, [containerRef, isAvatar]);

  const currentElement = useMemo(() => {
    if (!projectData?.scenes[0]) return null;
    return isAvatar
      ? projectData.scenes[0].avatar
      : projectData.scenes[0].background;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectData?.scenes[0], isAvatar]);

  useEffect(() => {
    if (!currentElement?.position || !projectData) return;

    const newPosition = {
      x: (currentElement.position.x / referenceDimensions.width) * 100,
      y: (currentElement.position.y / referenceDimensions.height) * 100,
    };

    if (
      Math.abs(position.x - newPosition.x) > 0.1 ||
      Math.abs(position.y - newPosition.y) > 0.1
    ) {
      setPosition((prev) => {
        if (
          Math.abs(prev.x - newPosition.x) < 0.1 &&
          Math.abs(prev.y - newPosition.y) < 0.1
        ) {
          return prev;
        }
        return newPosition;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentElement?.position?.x,
    currentElement?.position?.y,
    referenceDimensions.width,
    referenceDimensions.height,
  ]);

  useEffect(() => {
    if (!debouncedPosition || !currentElement?.id) return;

    const finalX = (debouncedPosition.x / 100) * referenceDimensions.width;
    const finalY = (debouncedPosition.y / 100) * referenceDimensions.height;

    const threshold = 1;
    if (
      Math.abs(currentElement.position.x - finalX) > threshold ||
      Math.abs(currentElement.position.y - finalY) > threshold
    ) {
      updateElementPosition(currentElement.id, isAvatar ?? false, {
        x: finalX,
        y: finalY,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedPosition,
    currentElement?.id,
    referenceDimensions.width,
    referenceDimensions.height,
  ]);

  useEffect(() => {
    if (!debouncedDimensions || !currentElement?.id) return;

    const finalSize = {
      width: percentToPxForFinal(
        debouncedDimensions.width,
        referenceDimensions.width
      ),
      height: percentToPxForFinal(
        debouncedDimensions.height,
        referenceDimensions.height
      ),
    };

    if (
      Math.abs(currentElement.size.width - finalSize.width) > 1 ||
      Math.abs(currentElement.size.height - finalSize.height) > 1
    ) {
      updateElementSize(currentElement.id, isAvatar ?? false, finalSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedDimensions,
    currentElement?.id,
    referenceDimensions.width,
    referenceDimensions.height,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (resizing) return;
    setDragging(true);
    if (containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - (position.x / 100) * container.width,
        y: e.clientY - (position.y / 100) * container.height,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - offset.x) / container.width) * 100;
      const newY = ((e.clientY - offset.y) / container.height) * 100;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    resizeDirection.current = null;
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    direction: string
  ) => {
    e.stopPropagation();
    setResizing(true);
    resizeDirection.current = direction;
    setInitialSize(dimensions);
    setInitialPos(position);
    setStartMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing || !containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - startMousePos.x;
      const deltaY = e.clientY - startMousePos.y;

      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newPosX = initialPos.x;
      let newPosY = initialPos.y;

      switch (resizeDirection.current) {
        case 'top-left': {
          const computedWidth =
            initialSize.width - (deltaX / container.width) * 100;
          const computedHeight =
            initialSize.height - (deltaY / container.height) * 100;

          if (computedWidth >= 100) {
            newWidth = 100;
            newPosX = initialPos.x;
          } else {
            newWidth = computedWidth;
            newPosX = initialPos.x + (deltaX / container.width) * 100;
          }
          if (computedHeight >= 100) {
            newHeight = 100;
            newPosY = initialPos.y;
          } else {
            newHeight = computedHeight;
            newPosY = initialPos.y + (deltaY / container.height) * 100;
          }
          break;
        }
        case 'top-right': {
          const computedHeight =
            initialSize.height - (deltaY / container.height) * 100;
          newWidth = initialSize.width + (deltaX / container.width) * 100;
          if (computedHeight >= 100) {
            newHeight = 100;
            newPosY = initialPos.y;
          } else {
            newHeight = computedHeight;
            newPosY = initialPos.y + (deltaY / container.height) * 100;
          }
          break;
        }
        case 'bottom-left': {
          const computedWidth =
            initialSize.width - (deltaX / container.width) * 100;
          newHeight = initialSize.height + (deltaY / container.height) * 100;
          if (computedWidth >= 100) {
            newWidth = 100;
            newPosX = initialPos.x;
          } else {
            newWidth = computedWidth;
            newPosX = initialPos.x + (deltaX / container.width) * 100;
          }
          break;
        }
        case 'bottom-right':
        default: {
          newWidth = initialSize.width + (deltaX / container.width) * 100;
          newHeight = initialSize.height + (deltaY / container.height) * 100;
          break;
        }
      }

      newWidth = Math.max(10, Math.min(newWidth, 100));
      newHeight = Math.max(10, Math.min(newHeight, 100));

      setDimensions({ width: newWidth, height: newHeight });
      setPosition({ x: newPosX, y: newPosY });
    },
    [resizing, containerRef, startMousePos, initialSize, initialPos]
  );

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleResizeMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing, handleResizeMouseMove]);

  let renderTransform = 'translate(0px, 0px)';
  let renderWidth = '0px';
  let renderHeight = '0px';
  if (containerRef.current) {
    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();
    renderTransform = `translate(${(position.x / 100) * containerWidth}px, ${
      (position.y / 100) * containerHeight
    }px)`;
    renderWidth = `${(dimensions.width / 100) * containerWidth}px`;
    renderHeight = `${(dimensions.height / 100) * containerHeight}px`;
  }

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!resizing) {
      setIsFocused(false);
    }
  };

  return (
    <S.DragImageContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
      aspectRatio={aspectRatio}>
      <S.ImageWrapper
        isAvatar={isAvatar}
        width={renderWidth}
        height={renderHeight}
        style={{ transform: renderTransform }}
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <>
          {isAvatar ? (
            <S.SelectedAvatarImage
              isAvatar={isAvatar}
              aspectRatio={aspectRatio}
              src={imgSrc}
              draggable={false}
              onFocus={handleFocus}
              onBlur={handleBlur}
              tabIndex={-1}
              autoPlay
              loop
            />
          ) : (
            <S.SelectedBackgroundImage
              isAvatar={isAvatar}
              aspectRatio={aspectRatio}
              src={imgSrc}
              alt={imgAlt}
              draggable={false}
              onFocus={handleFocus}
              onBlur={handleBlur}
              tabIndex={-1}
            />
          )}
          {isFocused && (
            <>
              <S.ResizeHandle
                className="top-left"
                onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
                onFocus={handleFocus}
              />
              <S.ResizeHandle
                className="top-right"
                onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
                onFocus={handleFocus}
              />
              <S.ResizeHandle
                className="bottom-left"
                onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
                onFocus={handleFocus}
              />
              <S.ResizeHandle
                className="bottom-right"
                onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
                onFocus={handleFocus}
              />
            </>
          )}
        </>
      </S.ImageWrapper>
    </S.DragImageContainer>
  );
}

const S = {
  DragImageContainer: styled.div<{ aspectRatio: string }>`
    ${(props) =>
      props.aspectRatio === '16:9(pc)' ? 'width:100%;' : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    user-select: none;
    position: relative;
    border: 2px solid ${theme.colors.secondary1};
    border-radius: ${theme.radius.medium};
    overflow: hidden;
  `,
  ImageWrapper: styled.div<{
    isAvatar: boolean | undefined;
    width: string;
    height: string;
  }>`
    position: absolute;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    transform: ${(props) => props.style?.transform || 'none'};
  `,
  SelectedBackgroundImage: styled.img<{
    isAvatar: boolean | undefined;
    aspectRatio: string;
  }>`
    width: 100%;
    height: 100%;
    position: absolute;
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  `,
  SelectedAvatarImage: styled.video<{
    isAvatar: boolean | undefined;
    aspectRatio: string;
  }>`
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: absolute;
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  `,
  ResizeHandle: styled.div`
    width: 15px;
    height: 15px;
    background-color: ${theme.colors.secondary1};
    border: 2px solid ${theme.colors.white};
    position: absolute;
    border-radius: ${theme.radius.circle};
    cursor: nwse-resize;
    &.top-left {
      top: -5px;
      left: -5px;
    }
    &.top-right {
      top: -5px;
      right: -5px;
      cursor: nesw-resize;
    }
    &.bottom-left {
      bottom: -5px;
      left: -5px;
      cursor: nesw-resize;
    }
    &.bottom-right {
      bottom: -5px;
      right: -5px;
    }
  `,
};

export default DragImage;
