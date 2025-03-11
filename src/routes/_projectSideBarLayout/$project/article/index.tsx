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

  const debouncedArticle = useDebounce(article, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value);
  };

  useEffect(() => {
    if (debouncedArticle) {
      // console.log(debouncedArticle);
      //추후 저장 로직으로 변경 예정
    }
  }, [debouncedArticle]);

  return (
    <S.ArticleBox>
      <textarea
        placeholder="기사를 입력해주세요"
        value={article}
        onChange={handleChange}
      />
    </S.ArticleBox>
  );
}

const S = {
  ArticleBox: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.black};
    border-radius: ${theme.radius.medium};
    padding: ${theme.spacing.md};
    textarea {
      width: 100%;
      height: 100%;
      border-radius: ${theme.radius.medium};
      padding: ${theme.spacing.md};
      box-sizing: border-box;
      font: inherit;
    }
  `,
};
