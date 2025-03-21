import theme from '@/styles/theme';
import styled from 'styled-components';
import { useState, ChangeEvent } from 'react';

type PhoneComponentProps = {
  formData: {
    name?: string | undefined;
    phone?: string | undefined;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsCheckPhone: (verified: boolean) => void;
};

export const PhoneComponent = ({ onInputChange, setIsCheckPhone }: PhoneComponentProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    onInputChange(e);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    onInputChange(e);
  };

  const handleVerification = () => {
    setIsVerified(true);
    setIsCheckPhone(true);
  };

  return (
    <>
      <h2>전화번호 인증을 진행해주세요</h2>
      <S.PhoneWrapper>
        <S.PhoneVerificationContainer>
          <S.PhoneName>
            <S.Row>
              <S.Label>이름</S.Label>
            </S.Row>
            <S.Input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              placeholder="이름을 입력해주세요"
            />
          </S.PhoneName>
          <S.PhoneNumber>
            <S.Row>
              <S.Label>휴대폰 번호</S.Label>
              <S.Hint>-를 빼고 입력해주세요</S.Hint>
            </S.Row>
            <S.Input
              type="text"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="휴대폰 번호를 입력해주세요"
              maxLength={11}
            />
          </S.PhoneNumber>

          <S.ButtonContainer>
            <S.CertificateButton onClick={handleVerification}>
              인증하기
            </S.CertificateButton>
          </S.ButtonContainer>
          <S.ButtonContainer>
            {isVerified && (
              <S.VerificationStatus>인증이 완료되었습니다</S.VerificationStatus>
            )}
          </S.ButtonContainer>
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
    padding: 2vh 0.5vw;
    background-color: ${theme.colors.background};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  ButtonContainer: styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 2vh;
    min-height: 4.5vh;
  `,
  CertificateButton: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 5vh;
    background-color: ${theme.colors.primary};
    border-radius: ${theme.radius.medium};
    color: ${theme.colors.white};
    cursor: pointer;
    border: none;

    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,
  Label: styled.label`
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.bold};
  `,
  Input: styled.input`
    width: 80%;
    height: 5vh;
    padding: 0 1vw;
    border: 1px solid ${theme.colors.border1};
    border-radius: 4px;
    font-size: ${theme.fontSizes.fz16};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  `,
  PhoneName: styled.div`
    width: 100%;
    padding: 2vh 0;
    margin-bottom: 2vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  PhoneNumber: styled.div`
    width: 100%;
    padding: 2vh 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  Hint: styled.p`
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.darkGray1};
    margin: 0;
    margin-left: auto;
  `,
  Row: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    margin-bottom: 1vh;
  `,
  VerificationStatus: styled.div`
    text-align: center;
    color: ${theme.colors.primary};
    font-weight: bold;
    margin-top: 1vh;
  `,
};

export default PhoneComponent;