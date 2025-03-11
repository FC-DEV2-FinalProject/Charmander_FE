import theme from '@/styles/theme';
import styled from 'styled-components';

export const PhoneComponent = () => {
  return (
    <>
      <h2>전화번호 인증을 진행해주세요</h2>
      <S.PhoneWrapper>
        <S.PhoneVerificationContainer>
          <p>전화번호 인증 컴포넌트</p>
        </S.PhoneVerificationContainer>
      </S.PhoneWrapper>
    </>
  );
};

const S = {
  PhoneWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 4vh;
    overflow-y: auto;
    margin-bottom: 20vh;
  `,
  PhoneVerificationContainer: styled.div`
    width: 75%;
    padding: 1.39vh 1vw;
    background-color: ${theme.colors.background};

    p {
      font-size: ${theme.fontSizes.fz24};
      text-align: center;
    }
  `,
};

export default PhoneComponent;
