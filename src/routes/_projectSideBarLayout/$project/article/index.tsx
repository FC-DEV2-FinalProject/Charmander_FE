import { useDebounce } from '@/hook/useDebounce';
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
  const [articleTitle, setArticleTitle] = useState('');

  const debouncedArticle = useDebounce(article, 1000);
  const debouncedArticleTitle = useDebounce(articleTitle, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value);
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArticleTitle(e.target.value);
  };

  useEffect(() => {
    if (debouncedArticle) {
      // console.log(debouncedArticle);
      //추후 저장 로직으로 변경 예정
    }
    if (debouncedArticleTitle) {
      // console.log(debouncedArticleTitle);
      //추후 저장 로직으로 변경
    }
  }, [debouncedArticle, debouncedArticleTitle]);

  return (
    <S.ArticleBox>
      <S.ArticleContentsBox>
        <label htmlFor="article-title">기사 제목</label>
        <S.ArticleTitle
          placeholder="제목을 입력해 주세요"
          value={articleTitle}
          onChange={handleTitleChange}
          id="article-title"
        />
      </S.ArticleContentsBox>
      <S.ArticleContentsBox>
        <label htmlFor="article-contents">기사 내용</label>
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
    background-color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.black};
    border-radius: ${theme.radius.medium};
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
      color: ${theme.colors.white};
    }
  `,
  ArticleTitle: styled.input`
    width: 100%;
    border-radius: ${theme.radius.medium};
    padding: ${theme.spacing.md};
    box-sizing: border-box;
    font: inherit;
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
  `,
};
