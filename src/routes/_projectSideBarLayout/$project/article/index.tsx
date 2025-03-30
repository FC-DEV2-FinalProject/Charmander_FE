import { postArticle } from '@/api/project/api';
import { useDebounce } from '@/hook/useDebounce';
import useArticlePDFStore from '@/store/useArticlePDFStore';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export const Route = createFileRoute(
  '/_projectSideBarLayout/$project/article/'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [article, setArticle] = useState('');
  const { articlePDFText, setArticlePDFText } = useArticlePDFStore();
  const { project } = Route.useParams();

  const debouncedArticle = useDebounce(article, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticlePDFText(e.target.value);
    setArticle(e.target.value);
  };

  useEffect(() => {
    const postProjectArticle = async () => {
      if (debouncedArticle) {
        await postArticle(project, debouncedArticle);
      }
    };
    postProjectArticle();
  }, [debouncedArticle, project]);

  useEffect(() => {
    if (articlePDFText != '') {
      setArticle(articlePDFText);
    }
  }, [articlePDFText]);

  return (
    <S.ArticleBox>
      <S.ArticleContentsBox>
        <label htmlFor="article-contents">기사 입력</label>
        <S.ArticleContentsText
          placeholder="기사를 입력해주세요"
          value={article}
          onChange={handleChange}
          id="article-contents"
        />
      </S.ArticleContentsBox>
    </S.ArticleBox>
  );
}

const S = {
  ArticleBox: styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: ${theme.spacing.md};
  `,
  ArticleContentsBox: styled.div`
    width: 100%;
    gap: ${theme.spacing.sm};
    &:last-child {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    label {
      font-size: ${theme.fontSizes.fz30};
    }
  `,

  ArticleContentsText: styled.textarea`
    width: 100%;
    height: 100%;
    flex-grow: 1;
    border-radius: ${theme.radius.medium};
    padding: ${theme.spacing.md};
    font: inherit;
    box-sizing: border-box;
    resize: none;
    border-color: ${theme.colors.primary};
    outline-color: ${theme.colors.primary};
  `,
};
