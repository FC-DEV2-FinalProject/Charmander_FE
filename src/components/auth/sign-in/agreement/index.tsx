import { useState, useEffect } from 'react';
import styled from 'styled-components';
import miniCheck from '@/assets/auth/mini-check.svg';
import nMiniCheck from '@/assets/auth/mini-none-check.svg';
import { TosModal } from '@/components/common/modal/tosModal';
import theme from '@/styles/theme';
type AgreementComponentType = {
  // eslint-disable-next-line no-unused-vars
  setIsChecked: (checked: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onRequiredAgreementChange: (isValid: boolean) => void;
  savedAgreements?: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
    youtube: boolean;
  };
  // eslint-disable-next-line no-unused-vars
  onAgreementsChange: (agreements: {
    privacy: boolean;
    terms: boolean;
    marketing: boolean;
    youtube: boolean;
  }) => void;
};

type StyledProps = {
  $isChecked?: boolean;
};

type ModalType = 'privacy' | 'terms' | 'marketing' | 'youtube' | null;

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
      youtube: false,
    }
  );
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [modalQueue, setModalQueue] = useState<ModalType[]>([]);

  function handleAllAgree() {
    // 아직 동의하지 않은 약관들을 큐에 넣습니다
    const pendingAgreements: ModalType[] = [];
    if (!agreements.privacy) pendingAgreements.push('privacy');
    if (!agreements.terms) pendingAgreements.push('terms');
    if (!agreements.marketing) pendingAgreements.push('marketing');
    if (!agreements.youtube) pendingAgreements.push('youtube');

    if (pendingAgreements.length === 0) {
      // 이미 모든 항목이 체크되어 있는 경우 해제 가능하도록 합니다
      const newValue = false;
      setIsChecked(newValue);

      const newAgreements = {
        privacy: newValue,
        terms: newValue,
        marketing: newValue,
        youtube: newValue,
      };

      setAgreements(newAgreements);
      onAgreementsChange(newAgreements);
    } else {
      // 아직 동의하지 않은 약관이 있으면 큐에 넣고 첫 번째 약관 모달을 엽니다
      setModalQueue(pendingAgreements);
      setShowModal(pendingAgreements[0]);
    }
  }

  function openModal(type: ModalType) {
    setShowModal(type);
  }

  function closeModal() {
    setShowModal(null);

    // 큐에서 현재 모달을 제거하고, 다음 모달이 있으면 엽니다
    if (modalQueue.length > 0) {
      const newQueue = [...modalQueue];
      newQueue.shift(); // 첫 번째 항목 제거
      setModalQueue(newQueue);

      if (newQueue.length > 0) {
        setShowModal(newQueue[0]); // 다음 모달 표시
      }
    }
  }

  function handleAgreementItemClick(type: ModalType) {
    // type이 null이 아닌지 확인
    if (type === null) return;

    // 이미 동의된 상태라면 바로 체크 해제
    if (agreements[type]) {
      const newAgreements = {
        ...agreements,
        [type]: false,
      };
      setAgreements(newAgreements);
      onAgreementsChange(newAgreements);

      // 전체 동의 체크박스 상태 업데이트
      setIsChecked(false);
    } else {
      // 동의되지 않은 상태라면 모달 표시
      openModal(type);
    }
  }

  function handleModalAgree() {
    if (!showModal) return;

    const newAgreements = {
      ...agreements,
      [showModal]: true,
    };

    setAgreements(newAgreements);
    onAgreementsChange(newAgreements);

    // 모든 항목이 체크되었는지 확인
    const allChecked = Object.values(newAgreements).every(
      (value) => value === true
    );
    setIsChecked(allChecked);

    closeModal(); // 이 함수는 이제 다음 모달이 있으면 자동으로 엽니다
  }

  function handleModalDisagree() {
    if (!showModal) return;

    const newAgreements = {
      ...agreements,
      [showModal]: false,
    };

    setAgreements(newAgreements);
    onAgreementsChange(newAgreements);

    // 모달 큐를 비웁니다 (전체 동의 프로세스 중단)
    setModalQueue([]);
    closeModal();
  }

  function isAllChecked() {
    return Object.values(agreements).every((value) => value === true);
  }

  const handleYoutubeConnect = () => {
    handleModalAgree();
  };

  useEffect(() => {
    function checkRequiredAgreements() {
      return agreements.privacy && agreements.terms;
    }

    onRequiredAgreementChange(checkRequiredAgreements());
  }, [agreements, onRequiredAgreementChange]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        setModalQueue([]);
        setShowModal(null);
      }
    };
    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  // 각 약관 유형에 맞는 모달 메시지 및 타입을 반환하는 함수
  const getModalContent = (type: ModalType) => {
    switch (type) {
      case 'privacy':
        return {
          title: '[필수] 개인정보처리방침',
          message: '개인정보처리방침에 관한 내용입니다. 동의하시겠습니까?',
          type: 'normal',
        };
      case 'terms':
        return {
          title: '[필수] 이용약관',
          message: '이용약관에 관한 내용입니다. 동의하시겠습니까?',
          type: 'normal',
        };
      case 'marketing':
        return {
          title: '[선택] 마케팅 이용 동의',
          message:
            '마케팅 이용에 동의하시면 다양한 이벤트 정보를 받아보실 수 있습니다. 동의하시겠습니까?',
          type: 'normal',
        };
      case 'youtube':
        return {
          title: '[선택] 유튜브 계정 연동',
          message:
            '유튜브 계정 연동에 동의하시면 서비스를 더 풍부하게 이용하실 수 있습니다.',
          type: 'youtube',
        };
      default:
        return {
          title: '',
          message: '',
          type: 'normal',
        };
    }
  };

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
            onClick={() => handleAgreementItemClick('privacy')}
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
            onClick={() => handleAgreementItemClick('terms')}
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
            onClick={() => handleAgreementItemClick('marketing')}
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

          <S.SelectionItem
            onClick={() => handleAgreementItemClick('youtube')}
            $isChecked={agreements.youtube}>
            {agreements.youtube ? (
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
            <p>[선택] 유튜브 계정 연동 동의</p>
          </S.SelectionItem>
        </S.SelectionList>
      </S.AgreementWrapper>

      {/* 모달 컴포넌트 */}
      {showModal && (
        <TosModal
          type={getModalContent(showModal).type as 'normal' | 'youtube'}
          title={getModalContent(showModal).title}
          message={getModalContent(showModal).message}
          onAgree={handleModalAgree}
          onDisagree={handleModalDisagree}
          onClose={closeModal}
          onYoutubeConnect={handleYoutubeConnect}
        />
      )}
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
