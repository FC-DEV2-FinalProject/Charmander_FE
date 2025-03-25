import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import check from '@/assets/auth/check-active.svg';
import AgreeComponent from '@/components/auth/sign-in/agreement';
import { VscTriangleLeft } from 'node_modules/react-icons/vsc';
import { Link, useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import theme from '@/styles/theme';

export const Route = createFileRoute('/auth/sign-up/sns/')({
  component: RouteComponent,
});

type StyledProps = {
  $inGroup?: boolean;
  $isActive?: boolean;
  disabled?: boolean;
  $isChecked?: boolean;
};

function RouteComponent() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [isChecked, setIsChecked] = useState(false);
  console.log(isChecked);
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    marketing: false,
    youtube: false,
  });
  const [requiredAgreementsChecked, setRequiredAgreementsChecked] =
    useState(false);

  function handleAgreementsChange(newAgreements: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
    youtube: boolean;
  }) {
    setAgreements(newAgreements);
  }

  const handleRequiredAgreementChange = (isValid: boolean) => {
    setRequiredAgreementsChecked(isValid);
  };

  const handleCompletion = () => {
    if (requiredAgreementsChecked) {
      navigate({ to: '/auth/login' });
    }
  };

  return (
    <S.SignInWrapper>
      <S.SignInContainer>
        <S.SignInState>
          <img
            src={check}
            alt="check-icon"
          />
        </S.SignInState>

        <S.AgreementContainer>
          <AgreeComponent
            setIsChecked={setIsChecked}
            onRequiredAgreementChange={handleRequiredAgreementChange}
            savedAgreements={agreements}
            onAgreementsChange={handleAgreementsChange}
          />
          <S.FooterContainer>
            <S.NextButtonContainer
              $inGroup={false}
              disabled={!requiredAgreementsChecked}
              $isActive={requiredAgreementsChecked}
              onClick={handleCompletion}>
              <p>완료</p>
            </S.NextButtonContainer>
            <S.BackToLogin>
              <VscTriangleLeft />
              <Link to="/auth/login">
                <span>로그인 화면으로</span>
              </Link>
            </S.BackToLogin>
          </S.FooterContainer>
        </S.AgreementContainer>
      </S.SignInContainer>
    </S.SignInWrapper>
  );
}

const S = {
  SignInWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: ${theme.colors.background};
  `,
  SignInContainer: styled.div`
    width: 30%;
    height: 90vh;
    background-color: ${theme.colors.white};
    display: flex;
    flex-direction: column;

    h2 {
      font-size: ${theme.fontSizes.fz32};
      font-weight: ${theme.fontWeights.bold};
      text-align: center;
      color: ${theme.colors.primary};
      margin-bottom: 4vh;
    }
  `,
  SignInState: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-bottom: 2vh;
    padding-top: 4vh;
  `,
  AgreementContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    position: relative;
  `,
  FooterContainer: styled.div`
    position: absolute;
    bottom: 4vh;
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4vh;
    padding: 0 2vw;
    background-color: ${theme.colors.white};
  `,
  NextButtonContainer: styled.div<StyledProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 6vh;
    border-radius: ${theme.radius.medium};
    background-color: ${(props) =>
      props.$isActive ? theme.colors.primary : '#ccc'};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.$isActive ? 1 : 0.7)};

    p {
      font-size: ${theme.fontSizes.fz24};
      color: ${theme.colors.white};
    }
  `,
  BackToLogin: styled.div`
    display: flex;
    align-items: center;
    font-size: ${theme.fontSizes.fz16};
    cursor: pointer;

    span {
      margin-left: 0.26vw;
    }
  `,
};
