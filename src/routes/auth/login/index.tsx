import theme from '@/styles/theme';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import { loginBanner } from '@/mock/mock';
import logo from '@/assets/logo/logo.png';
import KakaoLoginButton from '@/components/kakaoLoginButton';
import GoogleLoginButton from '@/components/googleLoginButton';
import BannerSlider from '@/components/common/bannerSlider';
import Input from '@/components/common/input';
import Checkbox from '@/components/common/selectBox/checkbox';
import { useCallback, useEffect, useRef, useState } from 'react';
import LinkButton from '@/components/common/button/linkButton';
import { useForm, Controller } from 'react-hook-form';
import { LoginSchema, type LoginSchemaType } from '@/schema/LoginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/api/login/api';
import { setTokens } from '@/utils/Tokens';
export const Route = createFileRoute('/auth/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { images } = loginBanner();
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function handleCheckChange() {
    setIsChecked(!isChecked);
  }

  function handleClick() {
    setIsChecked(!isChecked);
  }

  const onSubmit = useCallback(
    async (data: LoginSchemaType) => {
      const accessToken = await login(data.email, data.password);
      if (accessToken) {
        setTokens(accessToken);
        navigate({ to: '/dashboard' });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        if (
          activeElement === emailInputRef.current ||
          activeElement === passwordInputRef.current
        ) {
          handleSubmit(onSubmit)();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSubmit, onSubmit]);

  return (
    <S.LoginWrapper>
      <S.LoginContainer>
        <S.LoginLeftContainer>
          <BannerSlider images={images} />
          {/* <S.LoginTitleContainer>
            <h2>설명 아무거나</h2>
            <p>로그인 페이지에용</p>
          </S.LoginTitleContainer> */}
        </S.LoginLeftContainer>
        <S.LoginRightContainer>
          <S.LoginRightFormContainer>
            <S.LogoImg>
              <img
                src={logo}
                alt="logo"
              />
            </S.LogoImg>
            <S.LoginForm onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div
                      ref={(el) => {
                        if (el) {
                          const inputEl = el.querySelector('input');
                          emailInputRef.current = inputEl;
                        }
                      }}>
                      <Input
                        type="email"
                        {...field}
                      />
                    </div>
                  )}
                />
                <S.ErrorContainer>
                  {errors.email && (
                    <S.ErrorMessage>{errors.email.message}</S.ErrorMessage>
                  )}
                </S.ErrorContainer>
              </div>

              <div>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div
                      ref={(el) => {
                        if (el) {
                          const inputEl = el.querySelector('input');
                          passwordInputRef.current = inputEl;
                        }
                      }}>
                      <Input
                        type="password"
                        {...field}
                      />
                    </div>
                  )}
                />
                <S.ErrorContainer>
                  {errors.password && (
                    <S.ErrorMessage>{errors.password.message}</S.ErrorMessage>
                  )}
                </S.ErrorContainer>
              </div>

              <S.LoginRightSubContainer>
                <Checkbox
                  select={isChecked ? 'true' : ''}
                  onChange={handleCheckChange}
                  onClick={handleClick}>
                  아이디 저장
                </Checkbox>
                <Link to="/help/password">
                  <p>비밀번호를 잊으셨나요?</p>
                </Link>
              </S.LoginRightSubContainer>
              <S.LoginMaxWidth>
                <LinkButton
                  type="login"
                  onClick={handleSubmit(onSubmit)}
                />
              </S.LoginMaxWidth>
            </S.LoginForm>
            <S.LoginColumn>
              <span>또는</span>
              <KakaoLoginButton />
              <GoogleLoginButton />
            </S.LoginColumn>
            <S.LoginRow>
              <span>계정이 없나요?</span>
              <Link to="/auth/sign-in">
                <p>회원가입</p>
              </Link>
            </S.LoginRow>
          </S.LoginRightFormContainer>
        </S.LoginRightContainer>
      </S.LoginContainer>
    </S.LoginWrapper>
  );
}
const S = {
  LoginWrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
  `,
  LoginContainer: styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
  `,
  LoginLeftContainer: styled.div`
    width: 48%;
    height: 91%;
    background-color: ${theme.colors.background1};
    border-radius: ${theme.radius.large};
    position: relative;
    margin-left: 2%;
    margin-top: 2%;

    padding-top: 5%;
    padding-left: 5%;
  `,
  LoginForm: styled.div`
    margin-top: 20%;
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
  LoginTitleContainer: styled.div`
    margin-top: 7vh;
    max-width: 70%;
    height: 20%;
    overflow-wrap: break-word;
    h2 {
      font-size: ${theme.fontSizes.fz24};
      color: ${theme.colors.loginTitle};
      font-weight: ${theme.fontWeights.bold};
      margin-bottom: 2vh;
    }

    p {
      font-size: ${theme.fontSizes.fz14};
      color: ${theme.colors.loginTitle};
    }
  `,
  LoginRightContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    background-color: ${theme.colors.white};
    font-size: ${theme.fontSizes.fz16};
    padding-top: 10vh;
  `,
  LoginRightFormContainer: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 50%;
    height: 80%;
    position: relative;
    gap: 5%;
    padding: 0 20px 20px;
  `,
  LogoImg: styled.div`
    position: absolute;
    left: 0.8vw;
    top: 0;

    img {
      width: 60%;
    }
  `,
  ErrorContainer: styled.div`
    height: 2.5vh;
    margin-top: 1.5vh;
  `,
  ErrorMessage: styled.p`
    color: ${theme.colors.error};
    font-size: ${theme.fontSizes.fz18};
  `,
  LoginRightSubContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: ${theme.colors.darkGray3};
    font-size: ${theme.fontSizes.fz16};

    p {
      cursor: pointer;
      color: ${theme.colors.secondary2};
      font-weight: ${theme.fontWeights.bold};
    }
  `,

  LoginRow: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    margin-top: auto;

    span {
      color: ${theme.colors.darkGray2};

      font-weight: ${theme.fontWeights.regular};
    }

    p {
      cursor: pointer;
      color: ${theme.colors.secondary2};
      font-weight: ${theme.fontWeights.medium};
    }
  `,
  LoginColumn: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-width: 100%;
    gap: 1vh;
    position: relative;

    span {
      display: flex;
      align-items: center;
      width: 100%;
      text-align: center;
      font-weight: ${theme.fontWeights.regular};
      font-size: ${theme.fontSizes.fz16};
      color: ${theme.colors.darkGray2};
      margin-bottom: 2.5vh;
      position: relative;
    }

    span::before,
    span::after {
      content: '';
      flex-grow: 1;
      height: 1px;
      background-color: ${theme.colors.lightGray1};
      margin: 0 10px;
    }
  `,

  LoginMaxWidth: styled.div`
    min-width: 100%;
    margin-top: 3vh;
  `,
  LoginTempContainer: styled.div`
    width: 100%;
    height: 6vh;
    background-color: ${theme.colors.white};
    border-radius: ${theme.radius.medium};
    border: 1px solid ${theme.colors.black};
  `,
};

export default RouteComponent;
