import styled from 'styled-components';
import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { useDebounce } from '@/hook/useDebounce';
import theme from '@/styles/theme';

interface ImageProps {
  aspectRatio: string;
  src: string;
  alt: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isAvatar?: boolean;
}

interface Position {
  x: number;
  y: number;
}

function DragImage({
  aspectRatio,
  src,
  alt,
  containerRef,
  isAvatar,
}: ImageProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [resizing, setResizing] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

  const getDimensions = () => {
    if (isAvatar) {
      if (aspectRatio === '16:9(pc)') {
        return { width: '20%', height: '60%' };
      }
      return { width: '40%', height: '50%' };
    }
    return { width: '100%', height: '100%' };
  };
  const [dimensions, setDimensions] = useState(getDimensions());

  const imageRef = useRef<HTMLImageElement | null>(null);
  const resizeDirection = useRef<string | null>(null);

  // const debouncedSize = useDebounce(size, 1000);
  // const debouncedPosition = useDebounce(position, 1000);

  useEffect(() => {
    const savedPosition = localStorage.getItem(`${alt}_position`);
    if (savedPosition) setPosition(JSON.parse(savedPosition));
    const savedSize = localStorage.getItem(`${alt}_size`);
    if (savedSize) setDimensions(JSON.parse(savedSize));
  }, [alt]);

  useEffect(() => {
    localStorage.setItem(`${alt}_position`, JSON.stringify(position));
  }, [position, alt]);
  useEffect(() => {
    localStorage.setItem(`${alt}_size`, JSON.stringify(dimensions));
  }, [dimensions, alt]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (!resizing) {
      setIsFocused(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (resizing) return;
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging && containerRef.current) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

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
  };

  const handleResizeMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      let newWidth = parseFloat(dimensions.width || '50');
      let newHeight = parseFloat(dimensions.height || '50');

      if (resizeDirection.current?.includes('right')) {
        newWidth = ((e.clientX - container.left) / container.width) * 100;
      } else if (resizeDirection.current?.includes('left')) {
        newWidth = ((container.right - e.clientX) / container.width) * 100;
      }

      if (resizeDirection.current?.includes('bottom')) {
        newHeight = ((e.clientY - container.top) / container.height) * 100;
      } else if (resizeDirection.current?.includes('top')) {
        newHeight = ((container.bottom - e.clientY) / container.height) * 100;
      }

      setDimensions({
        width: `${Math.max(10, Math.min(newWidth, 100))}%`,
        height: `${Math.max(10, Math.min(newHeight, 100))}%`,
      });
    },
    [resizing, containerRef, dimensions]
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

  return (
    <S.DragImageContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}
      aspectRatio={aspectRatio}>
      <S.ImageWrapper
        isAvatar={isAvatar}
        width={dimensions.width ?? null}
        height={dimensions.height ?? null}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
        onBlur={handleBlur}>
        <S.SelectedBackgroundImage
          isAvatar={isAvatar}
          ref={imageRef}
          src={src}
          draggable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={-1}
        />
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
    width: string | null;
    height: string | null;
  }>`
    position: absolute;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    aspect-ratio: ${(props) => (props.isAvatar ? '9 / 16' : 'auto')};
  `,
  SelectedBackgroundImage: styled.img<{ isAvatar: boolean | undefined }>`
    width: 100%;
    height: 100%;
    aspect-ratio: ${(props) => (props.isAvatar ? '9 / 16' : 'auto')};
    object-fit: cover;
    position: absolute;
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
      cursor: nwse-resize;
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
      cursor: nwse-resize;
    }
  `,
};

export default DragImage;
