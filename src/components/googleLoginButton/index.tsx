import { googleOAuth } from '@/api/login/oAuth-config';
import google from '@/assets/logo/google-logo.png';
const GoogleLoginButton = () => {
  const initiateGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: googleOAuth.clientId,
      redirect_uri: googleOAuth.redirectUri,
      response_type: 'code',
      scope: googleOAuth.scope,
    });

    window.location.href = `${googleOAuth.authUrl}?${params.toString()}`;
  };

  return (
    <button
      onClick={initiateGoogleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        backgroundColor: '#ffffff',
        color: 'black',
        border: '1px solid #dadce0',
        borderRadius: '4px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        height: '5vh',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}>
      <img
        src={google}
        alt="google-logo"
        width="24px"
      />
      구글 계정으로 가입하기
    </button>
  );
};

export default GoogleLoginButton;
