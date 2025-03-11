import theme from '@/styles/theme';
import styled from 'styled-components';

export const PasswordComponent = () => {
  return (
    <>
      <h2>비밀번호를 설정해주세요</h2>
      <S.PasswordWrapper>
        <S.PasswordSetupContainer>
          <p>비밀번호 설정 컴포넌트</p>
        </S.PasswordSetupContainer>
      </S.PasswordWrapper>
    </>
  );
};

const S = {
  PasswordWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 4vh;
    overflow-y: auto;
    margin-bottom: 20vh;
  `,
  PasswordSetupContainer: styled.div`
    width: 75%;
    padding: 1.39vh 1vw;
    background-color: ${theme.colors.background};
    p {
      font-size: ${theme.fontSizes.fz24};
      text-align: center;
    }
  `,
};

export default PasswordComponent;
