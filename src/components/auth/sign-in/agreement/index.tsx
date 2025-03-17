import { useState, useEffect } from 'react';
import theme from '@/styles/theme';
import styled from 'styled-components';
import miniCheck from '@/assets/auth/mini-check.svg';
import nMiniCheck from '@/assets/auth/mini-none-check.svg';

type AgreementComponentType = {
  // eslint-disable-next-line no-unused-vars
  setIsChecked: (checked: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onRequiredAgreementChange: (isValid: boolean) => void;
  savedAgreements?: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
  };
  // eslint-disable-next-line no-unused-vars
  onAgreementsChange: (agreements: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
  }) => void;
};

type StyledProps = {
  $isChecked?: boolean;
};

export const AgreeComponent = ({
  setIsChecked,
  onRequiredAgreementChange,
  savedAgreements,
  onAgreementsChange,
}: AgreementComponentType) => {
  const [agreements, setAgreements] = useState(
    savedAgreements || {
      privacy: false,
      terms: false,
      marketing: false,
    }
  );

  function handleAllAgree() {
    const newValue = !isAllChecked();
    setIsChecked(newValue);

    const newAgreements = {
      privacy: newValue,
      terms: newValue,
      marketing: newValue,
    };

    setAgreements(newAgreements);
    onAgreementsChange(newAgreements);
  }

  function handleSingleAgree(key: 'privacy' | 'terms' | 'marketing') {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };

    setAgreements(newAgreements);
    onAgreementsChange(newAgreements);

    const allChecked = Object.values(newAgreements).every(
      (value) => value === true
    );
    setIsChecked(allChecked);
  }

  function isAllChecked() {
    return Object.values(agreements).every((value) => value === true);
  }

  useEffect(() => {
    function checkRequiredAgreements() {
      return agreements.privacy && agreements.terms;
    }

    onRequiredAgreementChange(checkRequiredAgreements());
  }, [agreements, onRequiredAgreementChange]);

  return (
    <>
      <h2>약관 동의 후 가입을 진행하실 수 있어요</h2>
      <S.AgreementWrapper>
        <S.AllAgreeContainer onClick={handleAllAgree}>
          {isAllChecked() ? (
            <img
              src={miniCheck}
              alt="mini-check-active"
            />
          ) : (
            <img
              src={nMiniCheck}
              alt="mini-check-none-active"
            />
          )}
          <p>전체 동의</p>
        </S.AllAgreeContainer>

        <S.SelectionList>
          <S.SelectionItem
            onClick={() => handleSingleAgree('privacy')}
            $isChecked={agreements.privacy}>
            {agreements.privacy ? (
              <img
                src={miniCheck}
                alt="mini-check-active"
              />
            ) : (
              <img
                src={nMiniCheck}
                alt="mini-check-none-active"
              />
            )}
            <p>[필수] 개인정보처리방침 동의</p>
          </S.SelectionItem>

          <S.SelectionItem
            onClick={() => handleSingleAgree('terms')}
            $isChecked={agreements.terms}>
            {agreements.terms ? (
              <img
                src={miniCheck}
                alt="mini-check-active"
              />
            ) : (
              <img
                src={nMiniCheck}
                alt="mini-check-none-active"
              />
            )}
            <p>[필수] 이용약관 동의</p>
          </S.SelectionItem>

          <S.SelectionItem
            onClick={() => handleSingleAgree('marketing')}
            $isChecked={agreements.marketing}>
            {agreements.marketing ? (
              <img
                src={miniCheck}
                alt="mini-check-active"
              />
            ) : (
              <img
                src={nMiniCheck}
                alt="mini-check-none-active"
              />
            )}
            <p>[선택] 마케팅 이용 동의</p>
          </S.SelectionItem>
        </S.SelectionList>
      </S.AgreementWrapper>
    </>
  );
};

const S = {
  AgreementWrapper: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 4vh;
    overflow-y: auto;
    margin-bottom: 20vh;
  `,
  AllAgreeContainer: styled.div`
    display: flex;
    align-items: center;
    width: 75%;
    padding: 1.39vh 1vw;
    background-color: ${theme.colors.background};
    cursor: pointer;

    img {
      width: 2.5vw;
      margin-right: 1vw;
    }

    p {
      font-size: ${theme.fontSizes.fz28};
      font-weight: ${theme.fontWeights.bold};
    }
  `,
  SelectionList: styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
  `,
  SelectionItem: styled.div<StyledProps>`
    display: flex;
    align-items: center;
    padding: 1.39vh 1vw;
    cursor: pointer;

    img {
      width: 2vw;
      margin-right: 1vw;
    }

    p {
      font-size: ${theme.fontSizes.fz24};
      font-weight: ${theme.fontWeights.medium};
      color: ${(props) => (props.$isChecked ? 'inherit' : '#9e9e9e')};
      transition: color 0.2s ease;
    }
  `,
};

export default AgreeComponent;
