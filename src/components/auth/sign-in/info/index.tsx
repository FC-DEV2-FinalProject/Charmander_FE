import theme from '@/styles/theme';
import styled from 'styled-components';
import { useState, ChangeEvent } from 'react';

export const InfoComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkedPassword, setCheckedPassword] = useState('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCheckPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCheckedPassword(e.target.value);
  };

  return (
    <>
      <h2>회원정보를 설정해주세요</h2>
      <S.InfoWrapper>
        <S.InfoSetupContainer>
          <S.InputSet>
            <S.Row>
              <S.Label>닉네임</S.Label>
            </S.Row>
            <S.Input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="닉네임을 입력해주세요"
            />
          </S.InputSet>
          <S.InputSet>
            <S.Row>
              <S.Label>이메일</S.Label>
              <S.Duplicate>이메일 인증</S.Duplicate>
            </S.Row>
            <S.Input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력해주세요"
            />
          </S.InputSet>

          <S.InputSet>
            <S.Row>
              <S.Label>비밀번호</S.Label>
            </S.Row>
            <S.Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요"
            />
          </S.InputSet>

          <S.InputSet>
            <S.Row>
              <S.Label>비밀번호 확인</S.Label>
            </S.Row>
            <S.Input
              type="password"
              value={checkedPassword}
              onChange={handleCheckPasswordChange}
              placeholder="다시 한번 비밀번호을 입력해주세요"
            />
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
    margin-bottom: 20vh;
  `,
  InfoSetupContainer: styled.div`
    width: 75%;
    height: 49vh;
    padding: 2vh 1.5vw;
    background-color: ${theme.colors.background};
    border-radius: ${theme.radius.medium};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  InputSet: styled.div`
    margin-bottom: 2vh;
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
  Duplicate: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30%;
    height: 5vh;
    background-color: ${theme.colors.primary};
    cursor: pointer;
    color: ${theme.colors.white};
    border-radius: ${theme.radius.medium};
    &:hover {
      background-color: ${theme.colors.secondary1};
    }
  `,
  Row: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin-bottom: 1vh;
  `,
};

export default InfoComponent;
