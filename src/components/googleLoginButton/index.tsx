import { googleOAuth } from '@/api/login/oAuth-config';
import { getAuthorizationUrl } from '@/api/login/oauth-service';
import google from '@/assets/logo/google-logo.png';
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    const authUrl = getAuthorizationUrl(googleOAuth);
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        backgroundColor: '#ffffff',
        color: 'black',
        border: '0.5px solid #dadce0',
        borderRadius: '4px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        height: '5vh',

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
