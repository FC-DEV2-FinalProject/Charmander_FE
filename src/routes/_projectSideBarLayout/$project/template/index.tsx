import { fetchTemplate, fetchTemplateCategories } from '@/api/project/api';
import DropDown from '@/components/common/dropdown';
import { useDebounce } from '@/hook/useDebounce';
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
  const { updateMedia, updateAvatar } = useProjectEditorStore();
  const [selectedCategory, setSelectedCategory] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    FetchTemplateResponse['data'][number] | null
  >(null);
  const [template, setTemplate] = useState<FetchTemplateResponse | undefined>();
  const [category, setCategory] = useState<
    {
      id: number;
      name: string;
    }[]
  >();
  const debouncedTemplate = useDebounce(selectedTemplate, 1000);
  const filteredTemplates =
    template?.data.filter(
      (template) =>
        selectedCategory && template.data.categoryId === selectedCategory.id
    ) || [];

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await fetchTemplateCategories();
        setCategory(data.data);
      } catch (err) {
        alert(err);
      }
    };
    loadCategory();
  }, []);
  useEffect(() => {
    const loadTemplateData = async () => {
      try {
        const data = await fetchTemplate();
        setTemplate(data);
      } catch (err) {
        alert(err);
      }
    };
    loadTemplateData();
  }, []);

  useEffect(() => {
    if (!debouncedTemplate) return;

    if (selectedTemplate) {
      updateMedia(selectedTemplate?.data.background);
      updateAvatar(selectedTemplate?.data.avatar);
    }
  }, [debouncedTemplate, selectedTemplate, updateAvatar, updateMedia]);

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
        {category && (
          <DropDown
            placeholder="템플릿 선택"
            dropDownData={category}
            width="90%"
            onSelect={(value) =>
              setSelectedCategory(
                category?.find((cat) => cat.id === Number(value)) || null
              )
            }
          />
        )}
        <S.TemplateList>
          {template ? (
            filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <S.TemplateCard
                  onClick={() => setSelectedTemplate(template)}
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={selectedTemplate?.id === template.id}
                    src={template.thumbnailUrl}
                    alt={String(template.id)}
                  />
                </S.TemplateCard>
              ))
            ) : (
              template.data.map((template) => (
                <S.TemplateCard
                  onClick={() => setSelectedTemplate(template)}
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={selectedTemplate?.id === template.id}
                    src={template.thumbnailUrl}
                    alt={String(template.id)}
                  />
                </S.TemplateCard>
              ))
            )
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
