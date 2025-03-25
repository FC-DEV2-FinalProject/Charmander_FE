import { BaseSchema, SignUpSchemaType } from '@/schema/SignUpSchema';
import api from '@/api/login/api';

type ApiResponse = {
  code?: string;
  message?: string;
};

type CheckEmailResult = {
  code?: string;
};

type VerifyEmailResult = {
  success: boolean;
  message: string;
};

export type RegistrationResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export const checkEmailEffect = async (
  email: string
): Promise<CheckEmailResult> => {
  const response = await api.post<ApiResponse>(
    '/api/v1/account/register/check-email',
    { email }
  );
  return response.data.code ? { code: response.data.code } : {};
};

export const VerifyEmailEffect = async (
  email: string,
  number: string
): Promise<VerifyEmailResult> => {
  try {
    const requestData = { email, code: number };
    const response = await api.post<ApiResponse>(
      '/api/v1/account/register/verify-email',
      requestData
    );

    return {
      success: true,
      message: response.data.message || '이메일 인증이 완료되었습니다.',
    };
  } catch {
    return {
      success: false,
      message: '이메일 인증 처리 중 알 수 없는 오류가 발생했습니다.',
    };
  }
};

export const validateEmail = async (email: string) => {
  const result = BaseSchema.pick({ email: true }).safeParse({ email });

  if (!result.success) {
    const formattedError = result.error.format();
    const errorMessage =
      formattedError.email?._errors[0] || '이메일 형식이 올바르지 않습니다';

    return {
      success: false,
      error: errorMessage,
    };
  }

  const checkResult = await checkEmailEffect(email);

  if (typeof checkResult.code !== 'string') {
    return {
      success: false,
      error: '인증 코드가 유효하지 않습니다',
    };
  }

  return {
    success: true,
    error: null,
    code: checkResult.code,
  };
};

export const registerUser = async (
  userData: SignUpSchemaType
): Promise<RegistrationResult> => {
  try {
    const response = await api.post('/api/v1/account/register', userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다',
    };
  }
};
