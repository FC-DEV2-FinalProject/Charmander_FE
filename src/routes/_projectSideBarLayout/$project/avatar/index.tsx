import DragImage from '@/components/project-editor/dragImage';
import { mockTemplateImage, Template } from '@/mock/mockTemplateImage';
import useAspectRatioStore from '@/store/useAspectRatioStore';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute('/_projectSideBarLayout/$project/avatar/')(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { aspectRatio } = useAspectRatioStore();
  const [SelectedAvatarTemplate, setSelectedAvatarTemplate] =
    useState<Template | null>(null);

  const templateImages = mockTemplateImage();
  const backgroundRef = useRef<HTMLDivElement>(null);

  return (
    <S.AvatarContainer>
      <S.AvatarMain>
        {SelectedAvatarTemplate && (
          <DragImage
            aspectRatio={aspectRatio}
            src={SelectedAvatarTemplate.imageUrl}
            alt={SelectedAvatarTemplate.name}
            containerRef={backgroundRef}
            isAvatar={true}
          />
        )}
      </S.AvatarMain>

      <S.AvatarToolbar>
        <S.TemplateSection>
          <S.LabelSection>
            <S.SidebarLabel>아바타 선택</S.SidebarLabel>
          </S.LabelSection>

          <S.AvatarTemplateList>
            {templateImages.map((template) => (
              <S.AvatarTemplateCard
                onClick={() => setSelectedAvatarTemplate(template)}
                key={template.id}>
                <S.AvatarTemplateImg
                  isSelected={SelectedAvatarTemplate?.id === template.id}
                  src={template.imageUrl}
                  alt={template.name}
                />
              </S.AvatarTemplateCard>
            ))}
          </S.AvatarTemplateList>
        </S.TemplateSection>
      </S.AvatarToolbar>
    </S.AvatarContainer>
  );
}
const S = {
  AvatarContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
  `,
  AvatarMain: styled.div`
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
  AvatarToolbar: styled.div`
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

  TemplateSection: styled.div`
    width: 90%;
    height: 100%;
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
  AvatarTemplateList: styled.div`
    background-color: ${theme.colors.background2};
    border-radius: ${theme.radius.medium};
    width: 100%;
    max-height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 120px;
    padding: ${theme.spacing.sm};
    gap: ${theme.spacing.sm};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  AvatarTemplateCard: styled.div`
    width: 100%;
    height: 100%;
  `,
  AvatarTemplateImg: styled.img<{ isSelected: boolean }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: ${(props) =>
      props.isSelected ? `2px solid ${theme.colors.secondary1}` : 'none'};
    box-sizing: border-box;
  `,
};
