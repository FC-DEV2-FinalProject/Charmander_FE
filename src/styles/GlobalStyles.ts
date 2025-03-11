import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import './font.css';

const GlobalStyles = createGlobalStyle`
    ${reset}


// 추가 전역 스타일 작성

    a {
    text-decoration: none;
    color: inherit;
    }

    body,html {
    font-family: "NexonLv2", "Malgun Gothic", "맑은 고딕", helvetica, sans-serif;
    font-size: ${({ theme }) => theme.fontSizes.fz16};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.lineHeights.small};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    }

    div, p, h1, h2, h3, h4, h5, h6{
    box-sizing: border-box;
    }

    button {
    border:none;
    background:none;
    font-size: inherit;
    cursor: pointer;
    }

`;

export default GlobalStyles;
