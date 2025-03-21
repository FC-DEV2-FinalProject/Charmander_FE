import theme from '@/styles/theme';
import styled from 'styled-components';
import { useState, ChangeEvent, useEffect } from 'react';
import {
  SignUpSchemaType,
  validateEmail,
} from '@/schema/SignUpSchema';
import { validateField } from '@/utils/validation';
import { VerifyEmailEffect } from '@/api/sign-up/api';

type InfoComponentProps = {
  formData: SignUpSchemaType;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setIsCheckInfo: (verified: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<SignUpSchemaType>>;
};

export const InfoComponent = ({ formData, onInputChange, setIsCheckInfo }: InfoComponentProps) => {
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    password?: string;
    checkPassword?: string;
  }>({});

  const [isChecking, setIsChecking] = useState({
    email: false,
  });

  const [isVerified, setIsVerified] = useState({
    email: false,
  });

  // 이메일 인증 상태를 추가
  const [emailVerificationStatus, setEmailVerificationStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');

  // 이메일 확인번호 컴포넌트 표시 상태
  const [showVerificationCode, setShowVerificationCode] = useState(false);

  const [validationStatus, setValidationStatus] = useState({
    email: false,
    password: false,
    checkPassword: false,
  });

  const [checkPassword, setCheckPassword] = useState('');

  useEffect(() => {
    const allFieldsValid = Object.values(validationStatus).every(
      (status) => status
    );
    const allVerified = isVerified.email;
    const passwordValid = validationStatus.password && validationStatus.checkPassword;

    // 모든 필드가 유효하고 이메일이 인증된 경우에만 완료
    setIsCheckInfo(allFieldsValid && allVerified && passwordValid);
  }, [validationStatus, isVerified, setIsCheckInfo]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 부모 컴포넌트의 formData 업데이트 (checkPassword 제외)
    if (name !== 'checkPassword') {
      onInputChange(e);
    }

    // 이메일이 변경되면 인증 상태 초기화
    if (name === 'email') {
      setEmailVerificationStatus('idle');
      setShowVerificationCode(false);
    }

    const validationResult = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationResult.error,
    }));

    // 비밀번호 유효성 검사
    if (name === 'password' && checkPassword) {
      const checkPasswordResult = validateField(
        'checkPassword',
        checkPassword,
        {
          ...formData,
          password: value,
        }
      );

      setErrors((prev) => ({
        ...prev,
        checkPassword: checkPasswordResult.error,
      }));

      setValidationStatus((prev) => ({
        ...prev,
        checkPassword:
          !checkPasswordResult.error && Boolean(checkPassword),
      }));
    }

    setValidationStatus((prev) => ({
      ...prev,
      [name]: !validationResult.error && Boolean(value),
    }));
  };

  const handleCheckPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCheckPassword(value);

    const validationResult = validateField('checkPassword', value, {
      ...formData,
      password: formData.password,
    });

    setErrors((prev) => ({
      ...prev,
      checkPassword: validationResult.error,
    }));

    setValidationStatus((prev) => ({
      ...prev,
      checkPassword: !validationResult.error && Boolean(value),
    }));
  };

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setErrors((prev) => ({
        ...prev,
        email: '이메일을 입력해주세요',
      }));
      return;
    }

    setIsChecking((prev) => ({ ...prev, email: true }));
    try {
      const result = await validateEmail(formData.email);

      if (result.success) {
        setErrors((prev) => ({ ...prev, email: undefined }));
        setValidationStatus((prev) => ({ ...prev, email: true }));
        setIsVerified((prev) => ({ ...prev, email: true }));

        setShowVerificationCode(true);
      } else {
        setErrors((prev) => ({ ...prev, email: result.error as string }));
        setValidationStatus((prev) => ({ ...prev, email: false }));
        setIsVerified((prev) => ({ ...prev, email: false }));
      }
    } catch (error) {
      console.error('이메일 검증 중 오류 발생:', error);
      setErrors((prev) => ({
        ...prev,
        email: '알 수 없는 오류가 발생했습니다',
      }));
      setValidationStatus((prev) => ({ ...prev, email: false }));
      setIsVerified((prev) => ({ ...prev, email: false }));
    } finally {
      setIsChecking((prev) => ({ ...prev, email: false }));
    }
  };

  const handleVerifyEmail = async (email: string, number: string) => {
    setEmailVerificationStatus('verifying');

    try {
      const result = await VerifyEmailEffect(email, number);

      if (result.success) {
        setEmailVerificationStatus('verified');
        setIsVerified((prev) => ({ ...prev, email: true }));
        setErrors((prev) => ({ ...prev, code: undefined }));
        setShowVerificationCode(false);
      } else {
        setEmailVerificationStatus('idle');
        setErrors((prev) => ({ ...prev, code: result.message }));
      }
    } catch (error) {
      setEmailVerificationStatus('idle');
      setErrors((prev) => ({ ...prev, code: '인증 처리 중 오류가 발생했습니다' }));
      console.error('이메일 인증 처리 중 오류:', error);
    }
  };

  const getVerifyButtonText = () => {
    if (emailVerificationStatus === 'verifying') {
      return '인증 중';
    } else if (emailVerificationStatus === 'verified') {
      return '인증 완료';
    } else {
      return '이메일 인증';
    }
  };

  const VerifyButton = ({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) => {
    return (
      <S.VerifyButton onClick={onClick} disabled={disabled}>
        {children}
      </S.VerifyButton>
    );
  };
  return (
    <>
      <h2>회원정보를 설정해주세요</h2>
      <S.InfoWrapper>
        <S.InfoSetupContainer>

          <S.InputSet>
            <S.Row>
              <S.Label>이메일</S.Label>
              <S.Duplicate
                onClick={handleEmailCheck}
                disabled={isChecking.email || emailVerificationStatus === 'verifying' || emailVerificationStatus === 'verified'}>
                {emailVerificationStatus === 'verified' 
                  ? '인증 완료' 
                  : emailVerificationStatus === 'verifying'
                    ? '인증 중'
                    : isChecking.email
                      ? '확인 중...'
                      : '이메일 인증'}
              </S.Duplicate>
            </S.Row>
            <S.Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요"
              disabled={emailVerificationStatus === 'verified'}
            />
            {errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
          </S.InputSet>

          {/* 이메일 인증 버튼을 누른 후에만 확인번호 입력 필드 표시 */}
          {showVerificationCode && emailVerificationStatus !== 'verified' && (
            <S.InputSet>
              <S.Row>
                <S.Label>이메일 확인 번호</S.Label>
              </S.Row>
              <S.CodeVerificationContainer>
                <S.Input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="이메일 확인 번호를 입력해주세요"
                />
                <VerifyButton 
                  onClick={() => handleVerifyEmail(formData.email, formData.code)}
                  disabled={emailVerificationStatus === 'verifying'}>
                  {getVerifyButtonText()}
                </VerifyButton>
              </S.CodeVerificationContainer>
              {errors.code && <S.ErrorMessage>{errors.code}</S.ErrorMessage>}
            </S.InputSet>
          )}

          <S.InputSet>
            <S.Row>
              <S.Label>비밀번호</S.Label>
            </S.Row>
            <S.Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력해주세요"
            />
            {errors.password && (
              <S.ErrorMessage>{errors.password}</S.ErrorMessage>
            )}
          </S.InputSet>

          <S.InputSet>
            <S.Row>
              <S.Label>비밀번호 확인</S.Label>
            </S.Row>
            <S.Input
              type="password"
              name="checkPassword"
              value={checkPassword}
              onChange={handleCheckPasswordChange}
              placeholder="다시 한번 비밀번호을 입력해주세요"
            />
            {errors.checkPassword && (
              <S.ErrorMessage>{errors.checkPassword}</S.ErrorMessage>
            )}
          </S.InputSet>
        </S.InfoSetupContainer>
      </S.InfoWrapper>
    </>
  );
};

const S = {
  InfoWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-y: auto;
    margin-bottom: 17vh;
  `,
  InfoSetupContainer: styled.div`
    width: 75%;
    height: auto;
    min-height: 43vh;
    padding: 2vh 1.5vw;
    background-color: ${theme.colors.background};
    border-radius: ${theme.radius.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  InputSet: styled.div`
    margin-bottom: 0.5vh;
    position: relative;
  `,
  Label: styled.label`
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.bold};
  `,
  Input: styled.input`
    width: 85%;
    height: 5vh;
    padding: 0 1vw;
    border: 1px solid ${theme.colors.border1};
    border-radius: ${theme.radius.medium};
    font-size: ${theme.fontSizes.fz16};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }
  `,
  Duplicate: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 3vh;
    background-color: ${theme.colors.primary};
    cursor: pointer;
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.radius.medium};
    &:hover {
      background-color: ${theme.colors.secondary1};
    }
    &:disabled {
      background-color: ${theme.colors.border1};
      cursor: not-allowed;
    }
  `,

   CodeVerificationContainer: styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
`,
 VerifyButton: styled.button`
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: #357abD;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  `,

  Row: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin-bottom: 2vh;
  `,
  ErrorMessage: styled.p`
    color: #ff0000;
    font-size: ${theme.fontSizes.fz14};
  `,
  SubmitButton: styled.button`
    width: 85%;
    height: 5vh;
    margin-top: 2vh;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.radius.medium};
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.bold};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,
};

export default InfoComponent;