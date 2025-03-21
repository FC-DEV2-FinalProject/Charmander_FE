import { useState } from 'react';
import theme from '@/styles/theme';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import check from '@/assets/auth/check-active.svg';
import nCheck from '@/assets/auth/check-none-active.svg';
import lock from '@/assets/auth/lock-active.svg';
import nLock from '@/assets/auth/lock-none-active.svg';
import phone from '@/assets/auth/phone-active.svg';
import nPhone from '@/assets/auth/phone-none-active.svg';
import { VscTriangleLeft } from 'react-icons/vsc';
import AgreeComponent from '@/components/auth/sign-in/agreement';
import PhoneComponent from '@/components/auth/sign-in/phone';
import InfoComponent from '@/components/auth/sign-in/info';
import { SignUpSchemaType } from '@/schema/SignUpSchema';
import { registerUser } from '@/api/sign-up/api';

export const Route = createFileRoute('/auth/sign-in/')({
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

  const [isChecked, setIsChecked] = useState(false);
  const [isPhoned, setIsPhoned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCheckPhone, setIsCheckPhone] = useState(false);
  const [isCheckInfo, setIsCheckInfo] = useState(false);
  const [formData, setFormData] = useState<SignUpSchemaType>({
    nickname: '',
    email: '',
    password: '',
    code: '',
    name: '',
    phone: '',
});

  // eslint-disable-next-line no-console
  console.log(isChecked, isPhoned, isLocked);
  
  const [requiredAgreementsChecked, setRequiredAgreementsChecked] = useState(false);
  const [agreements, setAgreements] = useState({
    privacy: false,
    terms: false,
    marketing: false,
    youtube: false,
  });

  const [currentStep, setCurrentStep] = useState(0);

  function handleAgreementsChange(newAgreements: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
    youtube: boolean;
  }) {
    setAgreements(newAgreements);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const goToNext = async () => {
    if (currentStep === 0 && requiredAgreementsChecked) {
      setCurrentStep(1);
      setIsPhoned(true);
    } else if (currentStep === 1 && isCheckPhone) {
      setCurrentStep(2);
      setIsLocked(true);
    } else if (currentStep === 2 && isCheckInfo) {
      console.log("Submitting form data:", formData);
      try {
        const result = await registerUser(formData);
        if (result.success) {
          navigate({ to: '/auth/sign-up/finish' });
        } else {
          console.error(result.error)
        }
      } catch (error) {
        console.error("Registration error:", error);

      }
    }
  };

  const goToPrev = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
      setIsLocked(false);
    } else if (currentStep === 1) {
      setCurrentStep(0);
      setIsPhoned(false);
    }
  };

  const handleRequiredAgreementChange = (isValid: boolean) => {
    setRequiredAgreementsChecked(isValid);
  };

  const handlePhoneVerification = (verified: boolean) => {
    setIsCheckPhone(verified);
  };

  const handleInfoVerification = (verified: boolean) => {
    setIsCheckInfo(verified);
  };

  const renderComponent = () => {
    if (currentStep === 0) {
      return (
        <AgreeComponent
          setIsChecked={setIsChecked}
          onRequiredAgreementChange={handleRequiredAgreementChange}
          savedAgreements={agreements}
          onAgreementsChange={handleAgreementsChange}
        />
      );
    } else if (currentStep === 1) {
      return (
        <PhoneComponent
          formData={formData}
          onInputChange={handleInputChange}
          setIsCheckPhone={handlePhoneVerification}
        />
      );
    } else if (currentStep === 2) {
      return (
        <InfoComponent
          formData={formData}
          onInputChange={handleInputChange}
          setIsCheckInfo={handleInfoVerification}
          setFormData={setFormData} // Pass setFormData to InfoComponent
        />
      );
    }
    return null;
  };

  const renderButtons = () => {
    if (currentStep === 0) {
      return (
        <S.NextButtonContainer
          $inGroup={false}
          onClick={goToNext}
          disabled={!requiredAgreementsChecked}
          $isActive={requiredAgreementsChecked}
        >
          <p>다음</p>
        </S.NextButtonContainer>
      );
    } else {
      return (
        <S.ButtonGroup>
          <S.PrevButtonContainer onClick={goToPrev}>
            <p>이전</p>
          </S.PrevButtonContainer>
          <S.NextButtonContainer
            $inGroup={true}
            onClick={goToNext}
            $isActive={currentStep === 1 ? isCheckPhone : isCheckInfo}
            disabled={
              (currentStep === 1 && !isCheckPhone) ||
              (currentStep === 2 && !isCheckInfo)
            }
          >
            <p>{currentStep === 2 ? '완료' : '다음'}</p>
          </S.NextButtonContainer>
        </S.ButtonGroup>
      );
    }
  };

  return (
    <S.SignInWrapper>
      <S.SignInContainer>
        <S.SignInState>
          <img
            src={currentStep === 0 ? check : nCheck}
            alt="check-icon"
          />
          <S.DottedDivider />
          <img
            src={currentStep === 1 ? phone : nPhone}
            alt="phone-icon"
          />
          <S.DottedDivider />
          <img
            src={currentStep === 2 ? lock : nLock}
            alt="lock-icon"
          />
        </S.SignInState>

        <S.AgreementContainer>
          {renderComponent()}
          <S.FooterContainer>
            {renderButtons()}
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
  DottedDivider: styled.div`
    border-bottom: none;
    height: 1px;
    background-image: linear-gradient(to right, #333 5px, transparent 1px);
    background-size: 10px 1px;
    background-repeat: repeat-x;
    width: 15%;
  `,
  AgreementContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
    position: relative;
  `,
  ContentContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 4vh;
    overflow-y: auto;
    margin-bottom: 20vh;
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
  ButtonGroup: styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 2vh;
  `,
  NextButtonContainer: styled.div<StyledProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) => (props.$inGroup ? '60%' : '100%')};
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
  PrevButtonContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 6vh;
    border-radius: ${theme.radius.medium};
    background-color: ${theme.colors.background};
    border: 1px solid ${theme.colors.primary};
    cursor: pointer;

    p {
      font-size: ${theme.fontSizes.fz24};
      color: ${theme.colors.primary};
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
