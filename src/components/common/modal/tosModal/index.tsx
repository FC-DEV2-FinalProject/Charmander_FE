/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import theme from '@/styles/theme';
import styled from 'styled-components';
import YoutubeImg from '@/assets/images/image.png';
import { youtubeOAuth } from '@/api/login/oAuth-config';
import { getAuthorizationUrl } from '@/api/login/oauth-service';

type TosModalProps = {
  type: 'normal' | 'youtube';
  title: string;
  message: string;
  onAgree: () => void;
  onDisagree: () => void;
  onClose: () => void;
  onYoutubeConnect: () => void;
};

export const TosModal = ({
  type,
  title,
  message,
  onAgree,
  onDisagree,
  onClose,
  onYoutubeConnect,
}: TosModalProps) => {
  const [checkboxes, setCheckboxes] = useState({
    all: false,
    youtube: false,
    google: false,
    privacy: false,
    security: false,
    userData: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const allChecked =
    checkboxes.youtube &&
    checkboxes.google &&
    checkboxes.privacy &&
    checkboxes.security &&
    checkboxes.userData;

  useEffect(() => {
    if (allChecked !== checkboxes.all) {
      setCheckboxes((prev) => ({ ...prev, all: allChecked }));
    }
  }, [
    checkboxes.youtube,
    checkboxes.google,
    checkboxes.privacy,
    checkboxes.security,
    checkboxes.userData,
    allChecked,
  ]);

  const handleYoutubeConnect = () => {
    onYoutubeConnect();
    if (!allChecked) return;

    setIsLoading(true);

    try {
      const authUrl = getAuthorizationUrl(youtubeOAuth);
      window.location.href = authUrl;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setIsLoading(false);
    }
  };
  const handleAllCheck = () => {
    setCheckboxes((prevCheckboxes) => {
      const newValue = !prevCheckboxes.all;
      return {
        all: newValue,
        youtube: newValue,
        google: newValue,
        privacy: newValue,
        security: newValue,
        userData: newValue,
      };
    });
  };

  const handleCheckboxChange = (name: keyof typeof checkboxes) => {
    setCheckboxes((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <S.TosModalWrapper>
      {type === 'normal' ? (
        <S.TosModalContainer>
          <S.ModalHeader>
            <S.ModalTitle>{title}</S.ModalTitle>
            <S.CloseButton onClick={onClose}>✕</S.CloseButton>
          </S.ModalHeader>
          <S.ModalContent>
            <S.ModalMessage>{message}</S.ModalMessage>
            <S.ButtonGroup>
              <S.DeclineButton onClick={onDisagree}>거부</S.DeclineButton>
              <S.AcceptButton onClick={onAgree}>동의</S.AcceptButton>
            </S.ButtonGroup>
          </S.ModalContent>
        </S.TosModalContainer>
      ) : (
        <S.TosModalContainer youtube>
          <S.ModalHeader>
            <S.ModalTitle>{title}</S.ModalTitle>
            <S.CloseButton onClick={onClose}>✕</S.CloseButton>
          </S.ModalHeader>
          <S.YoutubeContent>
            <S.YoutubeEmbed>
              <S.YoutubeTitle>
                <p>
                  유튜브 계정을 연동하시면, AiVARTAR에서 만든 비디오를 <br />
                  유튜브에 바로 업로드 할 수 있습니다.
                </p>
              </S.YoutubeTitle>
              <S.YoutubeImg>
                <img
                  src={YoutubeImg}
                  alt="YoutubeImg"
                />
              </S.YoutubeImg>
            </S.YoutubeEmbed>

            <S.YoutubeAllCheckbox>
              <input
                type="checkbox"
                id="all-checkbox"
                checked={checkboxes.all}
                onChange={handleAllCheck}
              />
              <label htmlFor="all-checkbox">
                아래의 API 클라이언트 이용 약관 및 개인정보 처리방침에 모두
                동의합니다
              </label>
            </S.YoutubeAllCheckbox>

            <S.CheckboxContainer>
              <input
                type="checkbox"
                id="youtube-checkbox"
                checked={checkboxes.youtube}
                onChange={() => handleCheckboxChange('youtube')}
              />
              <label htmlFor="youtube-checkbox">
                Youtube 서비스 약관을 준수하는 데 동의합니다
              </label>
            </S.CheckboxContainer>

            <S.CheckboxContainer>
              <input
                type="checkbox"
                id="google-checkbox"
                checked={checkboxes.google}
                onChange={() => handleCheckboxChange('google')}
              />
              <label htmlFor="google-checkbox">
                Google 개발자 서비스 사이트 약관을 준수하는 데 동의합니다
              </label>
            </S.CheckboxContainer>

            <S.CheckboxContainer>
              <input
                type="checkbox"
                id="privacy-checkbox"
                checked={checkboxes.privacy}
                onChange={() => handleCheckboxChange('privacy')}
              />
              <label htmlFor="privacy-checkbox">
                API 클라이언트 개인정보 처리방침에 Google개인정보 처리방침을
                확인하였습니다.
              </label>
            </S.CheckboxContainer>

            <S.CheckboxContainer>
              <input
                type="checkbox"
                id="security-checkbox"
                checked={checkboxes.security}
                onChange={() => handleCheckboxChange('security')}
              />
              <label htmlFor="security-checkbox">
                API 클라이언트의 액세스 권한을 취소하는 것에 대한 Google보안
                설정을 확인하였습니다
              </label>
            </S.CheckboxContainer>

            <S.CheckboxContainer>
              <input
                type="checkbox"
                id="userData-checkbox"
                checked={checkboxes.userData}
                onChange={() => handleCheckboxChange('userData')}
              />
              <label htmlFor="userData-checkbox">
                Google 사용자 데이터에 대한 액세스를 요청하는경우에 대한 Google
                API 서비스 사용자 데이터 정책을 확인하였습니다.
              </label>
            </S.CheckboxContainer>

            <S.ButtonGroup>
              <S.YoutubeConnectButton
                onClick={handleYoutubeConnect}
                disabled={!allChecked || isLoading}
                className={!allChecked || isLoading ? 'disabled' : ''}>
                {isLoading ? '연동 중...' : '유튜브로 계속하기'}
              </S.YoutubeConnectButton>
            </S.ButtonGroup>
          </S.YoutubeContent>
        </S.TosModalContainer>
      )}
    </S.TosModalWrapper>
  );
};

const S = {
  TosModalWrapper: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  `,

  TosModalContainer: styled.div<{ youtube?: boolean }>`
    background-color: ${theme.colors.white};
    border-radius: ${theme.radius.medium};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    width: ${(props) => (props.youtube ? '45%' : '35%')};
    min-height: ${(props) => (props.youtube ? '90vh' : 'auto')};
    max-height: 90vh;
    overflow-y: auto;
  `,

  ModalHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2vh 2vw;
    border-bottom: 1.5px solid ${theme.colors.darkGray1};
  `,

  ModalTitle: styled.h3`
    margin: 0;
    font-size: ${theme.fontSizes.fz24};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.primary};
  `,

  CloseButton: styled.button`
    background: none;
    border: none;
    font-size: ${theme.fontSizes.fz24};
    cursor: pointer;
    color: ${theme.colors.black};

    &:hover {
      color: ${theme.colors.primary};
    }
  `,

  ModalContent: styled.div`
    padding: 3vh 2vw;
    display: flex;
    flex-direction: column;
    gap: 3vh;
  `,

  ModalMessage: styled.p`
    font-size: ${theme.fontSizes.fz16};
    line-height: 1.5;
    color: ${theme.colors.black};
    margin: 0;
  `,

  YoutubeContent: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  `,

  YoutubeEmbed: styled.div`
    width: 100%;
    height: 40vh;
    background-color: ${theme.colors.background};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-bottom: 3px solid ${theme.colors.border1};
  `,

  YoutubeTitle: styled.div`
    width: 90%;
    height: 10vh;

    p {
      font-size: ${theme.fontSizes.fz16};
      text-align: center;
    }
  `,

  YoutubeImg: styled.div`
    width: 30%;
    height: auto;
    border-radius: ${theme.radius.circle};

    img {
      width: 100%;
      height: auto;
      max-width: 100%;
      display: block;
      margin: 0 auto;
    }
  `,

  YoutubeAllCheckbox: styled.div`
    width: 90%;
    border-bottom: 3px solid ${theme.colors.border1};
    display: flex;
    align-items: center;
    padding: 1.5vh 0;
    margin: 1.5vh auto;

    input[type='checkbox'] {
      margin-right: 15px;
      flex-shrink: 0;
    }

    label {
      font-size: ${theme.fontSizes.fz16};
      font-weight: ${theme.fontWeights.medium};
    }
  `,

  CheckboxContainer: styled.div`
    width: 90%;
    display: flex;
    align-items: flex-start;
    padding: 1vh 0;
    margin: 0.5vh auto;

    input[type='checkbox'] {
      margin-right: 15px;
      margin-top: 3px;
      flex-shrink: 0;
    }

    label {
      font-size: ${theme.fontSizes.fz14};
      flex-grow: 1;
    }
  `,

  ButtonGroup: styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 1vw;
    margin: 3vh auto;
    width: 90%;
  `,

  AcceptButton: styled.button`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.radius.medium};
    padding: 1vh 1.5vw;
    cursor: pointer;
    font-size: ${theme.fontSizes.fz16};

    &:hover {
      background-color: ${theme.colors.secondary1};
    }

    &.disabled {
      background-color: #ccc;
      cursor: not-allowed;

      &:hover {
        background-color: #ccc;
      }
    }
  `,

  DeclineButton: styled.button`
    background-color: ${theme.colors.background};
    color: #333;
    border: 1px solid ${theme.colors.primary};
    border-radius: ${theme.radius.medium};
    padding: 1vh 1.5vw;
    cursor: pointer;
    font-size: ${theme.fontSizes.fz16};

    &:hover {
      background-color: #e2e2e2;
    }
  `,

  YoutubeConnectButton: styled.button`
    background-color: #ff0000;
    color: ${theme.colors.white};
    border: none;
    border-radius: ${theme.radius.medium};
    padding: 1.5vh 2vw;
    cursor: pointer;
    font-size: ${theme.fontSizes.fz16};
    font-weight: ${theme.fontWeights.bold};
    width: 100%;
    max-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #cc0000;
    }

    &.disabled {
      background-color: #ccc;
      cursor: not-allowed;

      &:hover {
        background-color: #ccc;
      }
    }
  `,
};
