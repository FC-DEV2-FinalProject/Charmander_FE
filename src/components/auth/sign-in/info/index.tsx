import theme from '@/styles/theme';
import styled from 'styled-components';
import { useState, ChangeEvent, useEffect } from 'react';
import {
  SignUpSchemaType,
  BaseSchema,
  validateEmail,
  validateNickname,
} from '@/schema/SignUpSchema';
import { validateField } from '@/utils/validation';
import { ZodError } from 'zod';

type InfoComponentProps = {
  // eslint-disable-next-line no-unused-vars
  setIsCheckInfo: (verified: boolean) => void;
};

export const InfoComponent = ({ setIsCheckInfo }: InfoComponentProps) => {
  const [formData, setFormData] = useState<SignUpSchemaType>({
    nickname: '',
    email: '',
    password: '',
    checkPassword: '',
  });

  const [errors, setErrors] = useState<{
    nickname?: string;
    email?: string;
    password?: string;
    checkPassword?: string;
  }>({});

  const [isChecking, setIsChecking] = useState({
    nickname: false,
    email: false,
  });

  const [isVerified, setIsVerified] = useState({
    nickname: false,
    email: false,
  });

  const [validationStatus, setValidationStatus] = useState({
    nickname: false,
    email: false,
    password: false,
    checkPassword: false,
  });

  useEffect(() => {
    const allFieldsValid = Object.values(validationStatus).every(
      (status) => status
    );
    const allVerified = isVerified.nickname && isVerified.email;

    // 모든 필드가 유효하고 닉네임과 이메일이 중복 확인된 경우에만 완료
    setIsCheckInfo(allFieldsValid && allVerified);
  }, [validationStatus, isVerified, setIsCheckInfo]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'nickname' || name === 'email') {
      setIsVerified((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    const validationResult = validateField(name, value, formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationResult.error,
    }));

    // 해당 필드의 유효성 검사 상태 업데이트
    if (name === 'password' && formData.checkPassword) {
      const checkPasswordResult = validateField(
        'checkPassword',
        formData.checkPassword,
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
          !checkPasswordResult.error && Boolean(formData.checkPassword),
      }));
    }

    setValidationStatus((prev) => ({
      ...prev,
      [name]: !validationResult.error && Boolean(value),
    }));
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname) {
      setErrors((prev) => ({
        ...prev,
        nickname: '닉네임을 입력해주세요',
      }));
      return;
    }

    setIsChecking((prev) => ({ ...prev, nickname: true }));

    try {
      // baseSchema를 사용하여 닉네임 부분만 유효성 검사
      await BaseSchema.pick({ nickname: true }).parseAsync({
        nickname: formData.nickname,
      });

      // 닉네임 중복 검사 로직
      const result = await validateNickname(formData.nickname);
      if (result.success) {
        setErrors((prev) => ({ ...prev, nickname: undefined }));
        setValidationStatus((prev) => ({ ...prev, nickname: true }));
        setIsVerified((prev) => ({ ...prev, nickname: true }));
        alert('사용 가능한 닉네임입니다.');
      } else {
        setErrors((prev) => ({ ...prev, nickname: result.error as string }));
        setValidationStatus((prev) => ({ ...prev, nickname: false }));
        setIsVerified((prev) => ({ ...prev, nickname: false }));
      }
    } catch (error) {
      const zodError = error as {
        formErrors?: { fieldErrors?: { nickname?: string[] } };
      };
      if (zodError?.formErrors?.fieldErrors?.nickname?.[0]) {
        setErrors((prev) => ({
          ...prev,
          nickname: zodError.formErrors!.fieldErrors!.nickname![0],
        }));
        setValidationStatus((prev) => ({ ...prev, nickname: false }));
        setIsVerified((prev) => ({ ...prev, nickname: false }));
      }
    } finally {
      setIsChecking((prev) => ({ ...prev, nickname: false }));
    }
  };

  // 이메일 중복 확인
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
      // baseSchema를 사용하여 이메일 부분만 유효성 검사
      await BaseSchema.pick({ email: true }).parseAsync({
        email: formData.email,
      });

      // 이메일 중복 검사 로직
      const result = await validateEmail(formData.email);
      if (result.success) {
        setErrors((prev) => ({ ...prev, email: undefined }));
        setValidationStatus((prev) => ({ ...prev, email: true }));
        setIsVerified((prev) => ({ ...prev, email: true }));
        alert('사용 가능한 이메일입니다.');
      } else {
        setErrors((prev) => ({ ...prev, email: result.error as string }));
        setValidationStatus((prev) => ({ ...prev, email: false }));
        setIsVerified((prev) => ({ ...prev, email: false }));
      }
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const emailErrors = error.formErrors?.fieldErrors?.email;
        if (emailErrors && emailErrors.length > 0) {
          setErrors((prev) => ({
            ...prev,
            email: emailErrors[0],
          }));
          setValidationStatus((prev) => ({ ...prev, email: false }));
          setIsVerified((prev) => ({ ...prev, email: false }));
        }
      }
    }
  };
  return (
    <>
      <h2>회원정보를 설정해주세요</h2>
      <S.InfoWrapper>
        <S.InfoSetupContainer>
          <S.InputSet>
            <S.Row>
              <S.Label>닉네임</S.Label>
              <S.Duplicate
                onClick={handleNicknameCheck}
                disabled={isChecking.nickname}>
                {isChecking.nickname
                  ? '확인 중...'
                  : isVerified.nickname
                    ? '확인 완료'
                    : '중복 확인'}
              </S.Duplicate>
            </S.Row>
            <S.Input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder="닉네임을 입력해주세요"
            />
            {errors.nickname && (
              <S.ErrorMessage>{errors.nickname}</S.ErrorMessage>
            )}
          </S.InputSet>

          <S.InputSet>
            <S.Row>
              <S.Label>이메일</S.Label>
              <S.Duplicate
                onClick={handleEmailCheck}
                disabled={isChecking.email}>
                {isChecking.email
                  ? '확인 중...'
                  : isVerified.email
                    ? '인증 완료'
                    : '이메일 인증'}
              </S.Duplicate>
            </S.Row>
            <S.Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요"
            />
            {errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
          </S.InputSet>

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
              value={formData.checkPassword}
              onChange={handleInputChange}
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
    min-height: 49vh;
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
