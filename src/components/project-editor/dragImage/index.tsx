import styled from 'styled-components';
import React, { useRef, useState, useEffect } from 'react';
// import { useDebounce } from '@/hook/useDebounce';
import theme from '@/styles/theme';

interface ImageProps {
  aspectRatio: string;
  src: string;
  alt: string;
  size: Size;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface Size {
  width?: string | null;
  height?: string | null;
}

interface Position {
  x: number;
  y: number;
}

function DragImage({ aspectRatio, src, alt, size, containerRef }: ImageProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // const debouncedSize = useDebounce(size, 1000);
  // const debouncedPosition = useDebounce(position, 1000);

  useEffect(() => {
    const savedPosition = localStorage.getItem(`${alt}_position`);
    if (savedPosition) setPosition(JSON.parse(savedPosition));
  }, [alt]);

  useEffect(() => {
    localStorage.setItem(`${alt}_position`, JSON.stringify(position));
  }, [position, alt]);

  // useEffect(() => {
  //   const saveData = async () => {
  //     const data = {
  //       alt,
  //       size: debouncedSize,
  //       position: debouncedPosition,
  //     };
  //     try {
  //       await fetch('api URL 넣어주기', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(data),
  //       });
  //     } catch (error) {
  //       alert(`저장 실패:${error}`);
  //     }
  //   };
  //   if (debouncedSize && debouncedPosition) saveData();
  // }, [debouncedSize, debouncedPosition, alt]);

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    setDragging(true);
    setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !containerRef.current) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    const minX = -9999;
    const minY = -9999;
    const maxX = 9999;
    const maxY = 9999;

    setPosition({
      x: Math.max(minX, Math.min(newX, maxX)),
      y: Math.max(minY, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <S.DragImageContainer
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={containerRef}>
      <S.SelectedBackgroundImage
        ref={imageRef}
        src={src}
        aspectRatio={aspectRatio}
        width={size.width ? String(size.width) : null}
        height={size.height ? String(size.height) : null}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
        draggable={false}
      />
    </S.DragImageContainer>
  );
}
const S = {
  DragImageContainer: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    position: relative;
    overflow: hidden;
  `,
  SelectedBackgroundImage: styled.img<{
    aspectRatio: string;
    width: string | null;
    height: string | null;
  }>`
    ${(props) =>
      props.width || props.height !== null
        ? `width: ${props.width}px; height: ${props.height}px;`
        : props.aspectRatio === '16:9(pc)'
          ? 'width:100%;'
          : 'height:100%;'}
    aspect-ratio: ${(props) =>
      props.aspectRatio === '16:9(pc)' ? '16 / 9' : '9 / 16'};
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: 2px solid ${theme.colors.secondary1};
    box-sizing: border-box;
    position: absolute;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  `,
};

export default DragImage;
