import { fetchTemplate, fetchTemplateCategories } from '@/api/project/api';
import DropDown from '@/components/common/dropdown';
import { mockTemplateImage } from '@/mock/mockTemplateImage';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/template/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectData } = useProjectEditorStore();
  const backgroundTemplate = projectData?.scenes[0].media;
  const avatarTemplate = projectData?.scenes[0].avatar;
  // const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectTemplate] = useState({
    backgroundTemplate: backgroundTemplate || null,
    avatarTemplate: avatarTemplate || null,
  });
  const [template, setTemplate] = useState();
  const [category, setCategory] = useState<
    {
      id: number;
      name: string;
    }[]
  >();
  const templates = mockTemplateImage();

  const filteredTemplates = templates.templates.filter(
    (template) => template.type === selectedCategory
  );

  useEffect(() => {
    const loadCategory = async () => {
      try {
        // setLoading(true);
        const data = await fetchTemplateCategories();
        setCategory(data.data);
      } catch (err) {
        alert(err);
      } finally {
        // setLoading(false);
      }
    };
    loadCategory();
  }, []);
  useEffect(() => {
    const loadingData = async () => {
      try {
        // setLoading(true);
        const data = await fetchTemplate();
        setTemplate(data.data);
      } catch (err) {
        alert(err);
      } finally {
        // setLoading(false);
      }
    };
    loadingData();
  }, []);
  // eslint-disable-next-line no-console
  console.log(template);
  return (
    <S.TemplateContainer>
      <S.TemplateMain>
        {selectedTemplate && (
          <S.SelectedImageContainer>
            <S.SelectedTemplateImage
              src={selectedTemplate.backgroundTemplate?.url}
              alt={selectedTemplate.backgroundTemplate?.id}
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
            onSelect={(value) => setSelectedCategory(value)}
          />
        )}
        <S.TemplateList>
          {filteredTemplates.length > 0
            ? filteredTemplates.map((template) => (
                <S.TemplateCard
                  onClick={() =>
                    setSelectTemplate({
                      ...selectedTemplate,
                      backgroundTemplate: template,
                    })
                  }
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={
                      selectedTemplate.backgroundTemplate?.id === template.id
                    }
                    src={template.url}
                    alt={template.url}
                  />
                </S.TemplateCard>
              ))
            : templates.templates.map((template) => (
                <S.TemplateCard
                  onClick={() =>
                    setSelectTemplate({
                      ...selectedTemplate,
                      backgroundTemplate: template,
                    })
                  }
                  key={template.id}>
                  <S.TemplateImg
                    isSelected={
                      selectedTemplate.backgroundTemplate?.id === template.id
                    }
                    src={template.url}
                    alt={template.url}
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
