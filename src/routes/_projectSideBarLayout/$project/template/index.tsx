import DropDown from '@/components/common/dropdown';
import { mockTemplateImage, Template } from '@/mock/mockTemplateImage';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/template/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectTemplate] = useState<Template | null>(null);

  const templates = mockTemplateImage();

  const filteredTemplates = templates.filter(
    (template) => template.name === selectedCategory
  );

  return (
    <S.TemplateContainer>
      <S.TemplateMain>
        {selectedTemplate && (
          <S.SelectedTemplateImage
            src={selectedTemplate.imageUrl}
            alt={selectedTemplate.name}
          />
        )}
      </S.TemplateMain>
      <S.TemplateToolbar>
        <DropDown
          placeholder="템플릿 선택"
          dropDownData={['템플릿 1', '템플릿 2', '템플릿 3']}
          width="90%"
          onSelect={(value) => setSelectedCategory(value)}
        />
        <S.TemplateList>
          {filteredTemplates.length > 0
            ? filteredTemplates.map((template) => (
                <S.TemplateCard
                  onClick={() => setSelectTemplate(template)}
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={selectedTemplate?.id === template.id}
                    src={template.imageUrl}
                    alt={template.name}
                  />
                </S.TemplateCard>
              ))
            : templates.map((template) => (
                <S.TemplateCard
                  onClick={() => setSelectTemplate(template)}
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={selectedTemplate?.id === template.id}
                    src={template.imageUrl}
                    alt={template.name}
                  />
                </S.TemplateCard>
              ))}
        </S.TemplateList>
      </S.TemplateToolbar>
    </S.TemplateContainer>
  );
}

const S = {
  TemplateContainer: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
  `,
  TemplateMain: styled.div`
    background-color: ${theme.colors.white};
    width: 70%;
    height: calc(100vh - 180px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.xxlarge} 0 0 ${theme.radius.xxlarge};
  `,
  SelectedTemplateImage: styled.img`
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: ${`2px solid ${theme.colors.secondary1}`};
  `,
  TemplateToolbar: styled.div`
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
  TemplateList: styled.div`
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  TemplateCard: styled.div`
    width: 100%;
  `,
  TemplateImg: styled.img<{ isSelected: boolean }>`
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: ${theme.radius.medium};
    border: ${(props) =>
      props.isSelected ? `2px solid ${theme.colors.secondary1}` : 'none'};
    box-sizing: border-box;
  `,
  EmptyMessage: styled.p`
    font-size: ${theme.fontSizes.fz30};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.primary};
  `,
};
