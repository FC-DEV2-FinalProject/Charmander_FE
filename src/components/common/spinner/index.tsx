import LoadingIcon from '@/assets/icons/icon-loading.gif';
import styled from 'styled-components';

const Spinner = () => {
  return (
    <S.Spinner>
      <img
        src={LoadingIcon}
        alt="Loading..."
      />
    </S.Spinner>
  );
};

export default Spinner;

const S = {
  Spinner: styled.div`
    width: 120px;
    img {
      width: 100%;
    }
  `,
};
