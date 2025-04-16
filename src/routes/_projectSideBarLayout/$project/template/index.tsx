import DropDown from '@/components/common/dropdown';
import LoadingSpinner from '@/components/common/loading/LoadingSpinner';
import { useTemplates } from '@/hook/useTemplateList';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import theme from '@/styles/theme';
import { FetchTemplateResponse } from '@/types/template';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/template/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { updateBackground, updateAvatar } = useProjectEditorStore();
  const { templatesQuery, templateCategoriesQuery } = useTemplates();
  const { data: templateList, isLoading: templateLoading } = templatesQuery;
  const { data: templateCategories, isLoading: categoriesLoading } =
    templateCategoriesQuery;
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    FetchTemplateResponse['data'][number] | null
  >(null);

  const templatesToShow = templateList
    ? selectedCategory
      ? templateList.data.filter(
          (template) => template.data.categoryId === selectedCategory.id
        )
      : templateList.data
    : [];

  useEffect(() => {
    if (selectedTemplate) {
      updateBackground(selectedTemplate?.data.background);
      updateAvatar(selectedTemplate?.data.avatar);
    }
  }, [selectedTemplate, updateAvatar, updateBackground]);

  if (templateLoading && categoriesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <S.TemplateContainer>
      <S.TemplateMain>
        {selectedTemplate && (
          <S.SelectedImageContainer>
            <S.SelectedTemplateImage
              src={selectedTemplate.thumbnailUrl}
              alt={String(selectedTemplate.id)}
            />
          </S.SelectedImageContainer>
        )}
      </S.TemplateMain>
      <S.TemplateToolbar>
        {templateCategories && (
          <DropDown
            placeholder="템플릿 선택"
            dropDownData={templateCategories.data}
            width="90%"
            onSelect={(value) =>
              setSelectedCategory(
                templateCategories.data.find(
                  (category) => category.id === Number(value)
                ) || null
              )
            }
          />
        )}
        <S.TemplateList>
          {templatesToShow.length > 0 ? (
            templatesToShow.map((template) => (
              <S.TemplateCard
                key={template.id}
                onClick={() => setSelectedTemplate(template)}>
                <S.TemplateImg
                  isSelected={selectedTemplate?.id === template.id}
                  src={template.thumbnailUrl}
                  alt={String(template.id)}
                />
              </S.TemplateCard>
            ))
          ) : (
            <S.EmptyMessage>템플릿이 없습니다.</S.EmptyMessage>
          )}
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
    padding: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.xxlarge} 0 0 ${theme.radius.xxlarge};
  `,
  SelectedImageContainer: styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
  `,
  SelectedTemplateImage: styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16 / 9;
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
    height: 100%;
  `,
  TemplateImg: styled.img<{ isSelected: boolean }>`
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 9;
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
