import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

// 회전 애니메이션 정의
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 로딩 스피너 스타일
const SpinnerWrapper = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db; // 스피너 색상 (필요에 따라 변경)
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

// 로딩 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0;
`;

// 로딩 텍스트 스타일
const Text = styled.p`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

interface LoadingSpinnerProps {
  text?: string;
  showText?: boolean;
}

const LoadingSpinner = ({
  text = '로딩 중...',
  showText = true,
}: LoadingSpinnerProps) => {
  return (
    <Container>
      <SpinnerWrapper />
      {showText && <Text>{text}</Text>}
    </Container>
  );
};

export default LoadingSpinner;
