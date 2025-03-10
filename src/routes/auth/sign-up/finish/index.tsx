import { createFileRoute } from '@tanstack/react-router';
import styled from 'styled-components';
import check from '@/assets/auth/check-active.svg';
import theme from '@/styles/theme';
import LinkButton from '@/components/common/button/linkButton';

export const Route = createFileRoute('/auth/sign-up/finish/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <S.SignUpFinishWrapper>
      <S.SignUpFinishContainer>
        <img
          src={check}
          alt="finishImg"
        />
        <h2>회원가입이 완료되었습니다</h2>
        <S.MaxWidth>
          <LinkButton type="finish" />
        </S.MaxWidth>
      </S.SignUpFinishContainer>
    </S.SignUpFinishWrapper>
  );
}

const S = {
  SignUpFinishWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
  `,
  SignUpFinishContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 29%;
    height: 50%;
    flex-direction: column;
    gap: 10%;

    h2 {
      font-weight: ${theme.fontWeights.bold};
      font-size: ${theme.fontSizes.fz50};
      color: ${theme.colors.primary};
    }
  `,
  MaxWidth: styled.div`
    width: 100%;
  `,
};
