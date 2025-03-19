import DropDown from '@/components/common/dropdown';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styled from 'styled-components';
import image1 from '@/assets/loginBanner/image1.png';
import image2 from '@/assets/loginBanner/image2.png';
import image3 from '@/assets/loginBanner/image3.png';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/template/'
)({
  component: RouteComponent,
});
type Template = {
  id: number;
  name: string;
  imageUrl: string;
};

const templates: Template[] = [
  { id: 1, name: '템플릿 1', imageUrl: image1 },
  { id: 2, name: '템플릿 2', imageUrl: image2 },
  { id: 3, name: '템플릿 1', imageUrl: image3 },
  { id: 4, name: '템플릿 3', imageUrl: image1 },
  { id: 5, name: '템플릿 1', imageUrl: image2 },
  { id: 6, name: '템플릿 3', imageUrl: image3 },
];

function RouteComponent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectTemplate] = useState<Template | null>(null);

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
    height: calc(100vh - 180px);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.xl};
    gap: ${theme.spacing.lg};
    border-radius: ${theme.radius.large};
  `,
  TemplateMain: styled.div`
    background-color: ${theme.colors.white};
    width: 70%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.spacing.sm};
    border-radius: ${theme.radius.large};
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
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${theme.spacing.lg};
    gap: ${theme.spacing.xl};
    border-radius: ${theme.radius.large};
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
