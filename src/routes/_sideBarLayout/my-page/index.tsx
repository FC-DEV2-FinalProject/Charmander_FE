import ImageUpload from '@/components/common/imageUpload';
import theme from '@/styles/theme';
import { createFileRoute } from '@tanstack/react-router';
import styled from 'styled-components';
import { useState } from 'react';

export const Route = createFileRoute('/_sideBarLayout/my-page/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCheckPassword, setNewCheckPassword] = useState('');

  function handleSubmit() {
    // API 호출 코드
  }

  function handleReset() {
    setEmail('');
    setName('');
    setPhoneNumber('');
    setCurrentPassword('');
    setNewPassword('');
    setNewCheckPassword('');
  }

  return (
    <S.MyPageWrapper>
      <S.MyPageContainer>
        <S.MyPageHeader>
          <div>
            <p>아이디</p>
          </div>
          <ImageUpload />
        </S.MyPageHeader>
        <form onSubmit={handleSubmit}>
          <S.MyPageBasic>
            <h2>기본 정보 수정</h2>
            <S.InputLabel>
              아이디
              <S.Row>
                <S.Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                />
                <S.CertifiButton>인증하기</S.CertifiButton>
              </S.Row>
            </S.InputLabel>
            <S.InputLabel>
              닉네임
              <S.Row>
                <S.Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                />
                <S.duplicateButton>중복확인</S.duplicateButton>
              </S.Row>
            </S.InputLabel>
            <S.InputLabel>
              전화번호
              <S.Row>
                <S.Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder=""
                />
                <S.CertifiButton>인증하기</S.CertifiButton>
              </S.Row>
            </S.InputLabel>
          </S.MyPageBasic>
          <S.MyPagePassword>
            <h2>비밀번호 재설정</h2>
            <S.InputLabel>
              현재 비밀번호
              <S.Input
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
              />
            </S.InputLabel>
            <S.InputLabel>
              새 비밀번호
              <S.Input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호"
              />
            </S.InputLabel>
            <S.InputLabel>
              새 비밀번호 확인
              <S.Input
                value={newCheckPassword}
                onChange={(e) => setNewCheckPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
              />
            </S.InputLabel>
          </S.MyPagePassword>
        </form>
        <S.MyPageFooter>
          <S.WithdrawButton>탈퇴하기</S.WithdrawButton>
          <div>
            <S.Row>
              <S.ResetButton onClick={handleReset}>초기화</S.ResetButton>
              <S.SaveButton onClick={handleSubmit}>저장</S.SaveButton>
            </S.Row>
          </div>
        </S.MyPageFooter>
      </S.MyPageContainer>
    </S.MyPageWrapper>
  );
}

const S = {
  MyPageWrapper: styled.div`
    width: 100%;
    height: 100%;
    background-color: ${theme.colors.background};
    padding-left: 5%;
  `,
  MyPageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 18vh;
    margin-top: 4vh;
    background-color: ${theme.colors.white};
  `,
  MyPageHeader: styled.div`
    display: flex;
    width: 100%;
    margin-left: 2vw;
    flex-direction: column;
    gap: 3vh;
    padding-top: 2vh;
    p {
      font-size: ${theme.fontSizes.fz24};
      font-weight: ${theme.fontWeights.bold};
    }
  `,
  MyPageBasic: styled.div`
    margin-top: 6vh;
    width: 100%;
    height: 40vh;
    padding: 2vh 0;
    padding-left: 2vw;
    background-color: ${theme.colors.white};
    h2 {
      font-size: ${theme.fontSizes.fz24};
      font-weight: ${theme.fontWeights.bold};
      margin-bottom: 2vh;
    }
  `,
  MyPagePassword: styled.div`
    width: 100%;
    height: auto;
    padding: 2vh 0;
    display: flex;
    flex-direction: column;
    padding-left: 2vw;
    margin-top: 3vh;
    gap: 1vh;
    background-color: ${theme.colors.white};

    h2 {
      font-size: ${theme.fontSizes.fz24};
      font-weight: ${theme.fontWeights.bold};
      margin-bottom: 2vh;
    }
  `,
  MyPageFooter: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 100%;
    min-height: 10vh;
    margin-top: 2vh;
  `,
  InputLabel: styled.label`
    display: flex;
    flex-direction: column;
    margin-bottom: 2vh;
  `,
  Input: styled.input`
    width: 30%;
    height: 4vh;
    margin-top: 0.5vh;
    border-radius: ${theme.radius.medium};
    border: 1px solid ${theme.colors.lightGray1};
    padding-left: 0.5vw;
  `,
  CertifiButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
    width: 8%;
    height: 5vh;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.fz14};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,

  duplicateButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: ${theme.radius.large};
    width: 8%;
    height: 5vh;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.fz14};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,

  Row: styled.div`
    display: flex;
    width: auto;
    min-width: 20vw;
    flex-direction: row;
    gap: 2%;
  `,

  WithdrawButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    height: 5vh;
    background-color: ${theme.colors.lightGray1};
    color: ${theme.colors.withdraw};
    font-size: ${theme.fontSizes.fz16};
    border-radius: ${theme.radius.medium};
    cursor: pointer;
    &:hover {
      background-color: ${theme.colors.lightGray2};
    }
  `,
  ResetButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 6vh;
    background-color: ${theme.colors.white};
    color: ${theme.colors.black};
    border-radius: ${theme.radius.medium};
    cursor: pointer;
    font-size: ${theme.fontSizes.fz24};
    font-weight: ${theme.fontWeights.medium};

    &:hover {
      background-color: ${theme.colors.lightGray1};
    }
  `,
  SaveButton: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 6vh;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    font-size: ${theme.fontSizes.fz24};
    border-radius: ${theme.radius.medium};
    cursor: pointer;
    font-weight: ${theme.fontWeights.bold};
    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,
};
