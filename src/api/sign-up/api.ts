import { BaseSchema, SignUpSchemaType } from "@/schema/SignUpSchema";
import axios from "axios";



export type RegistrationResult = {
    success: boolean;
    data?: any;
    error?: any;
};

// 이메일 인증 코드 요청을 위한 API 호출 함수
export async function checkEmailEffect(email: string): Promise<{ code?: string }> {
    try {
        const response = await axios.post('/api/v1/account/register/check-email', {
            email: email
        });

        if (response.data && response.data.code) {
            return { code: response.data.code }; 
        } else {
            return { code: undefined }; 
        }
    } catch (error: unknown) {
        throw error; 
    }
}


export async function VerifyEmailEffect(email: string, number: string): Promise<{ success: boolean; message?: string }> {
    try {
        const requestData = {
            email: email,
            code: number
        };

        const response = await axios.post('/api/v1/account/register/verify-email', requestData);
        
        return {
            success: true,
            message: response.data.message || '이메일 인증이 완료되었습니다.'
        };
    } catch (error: unknown) {
        let message: string;
        if (axios.isAxiosError(error) && error.response) {
            message = error.response.data.message || '이메일 인증 처리 중 오류가 발생했습니다.';
        } else {
            message = '이메일 인증 처리 중 알 수 없는 오류가 발생했습니다.';
        }

        return {
            success: false,
            message: message
        };
    }
}




export const validateEmail = async (email: string) => {
    console.log('이메일 유효성 검사 시작:', email);
    
    try {
        const result = BaseSchema.pick({ email: true }).safeParse({ email });
        if (!result.success) {
            const formattedError = result.error.format();
            const errorMessage = formattedError.email?._errors[0] || '이메일 형식이 올바르지 않습니다';
            console.log('이메일 형식 오류:', errorMessage);
            
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
            code: checkResult.code
        };
    } catch (error) {
        console.error('이메일 검증 중 예상치 못한 오류:', error);
        return { success: false, error: '알 수 없는 오류가 발생했습니다' };
    }
};


export const registerUser = async (userData: SignUpSchemaType): Promise<RegistrationResult> => {
    try {
      const response = await axios.post('/api/v1/account/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('회원가입 실패:', error.response?.data);
      console.error('오류 상태 코드:', error.response?.status);
      return {
        success: false,
        error: error.response?.data?.message
      };
    }
  };