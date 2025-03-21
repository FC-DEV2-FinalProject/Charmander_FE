/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { z } from 'zod';
import {checkEmailEffect } from '@/api/sign-up/api';


export type SignUpSchemaType = {
  code: string;
  nickname: string;
  email: string;
  password: string;
  name?: string | undefined;
  phone?: string | undefined;
};

export const BaseSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2글자 이상이어야 합니다')
    .max(20, '닉네임은 최대 10글자까지 가능합니다'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      '비밀번호를 숫자, 영문 포함 8자리 이상으로 입력해주세요'
    ),
  checkPassword: z.string(),
});

export const SignUpSchema = BaseSchema.refine(
  (data) => data.password === data.checkPassword,
  {
    message: '비밀번호가 일치하지 않습니다',
    path: ['checkPassword'],
  }
);

export const validateEmail = async (email: string) => {
  try {
    const result = BaseSchema.pick({ email: true }).safeParse({ email });
    if (!result.success) {
      const formattedError = result.error.format();
      return {
        success: false,
        error:
          formattedError.email?._errors[0] || '이메일 형식이 올바르지 않습니다',
      };
    }

    const code = await checkEmailEffect(email);
    return { success: true, error: null, code: code };
  } catch (error) {
    return { success: false, error: '알 수 없는 오류가 발생했습니다' };
  }
};

export const validatePassword = (password: string) => {
  return BaseSchema.pick({ password: true }).safeParse({ password });
};

export const validatePasswordMatch = (
  password: string,
  checkPassword: string
) => {
  const passwordResult = validatePassword(password);
  if (!passwordResult.success) {
    return passwordResult;
  }

  if (password !== checkPassword) {
    return {
      success: false,
      error: '비밀번호가 일치하지 않습니다',
    };
  }

  return { success: true, error: null };
};

export const validateSignUpSchema = async (data: SignUpSchemaType) => {
  try {
    const formResult = SignUpSchema.safeParse(data);
    if (!formResult.success) {
      return { success: false, error: formResult.error.format() };
    }

    /*
    const nicknameResult = await checkNicknameDuplicate(data.nickname);
    if (nicknameResult) {
      return {
        success: false,
        error: {
          nickname: { _errors: ['이미 사용 중인 닉네임입니다'] },
        },
      };
    }

    const emailResult = await checkEmailDuplicate(data.email);
    if (emailResult) {
      return {
        success: false,
        error: {
          email: { _errors: ['이미 가입된 이메일입니다'] },
        },
      };
    }
    */

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.format() };
    }
    return { success: false, error: '알 수 없는 오류가 발생했습니다' };
  }
};

export const validateField = (
  name: string,
  value: string,
  formData: { password: string; [key: string]: string }
) => {
  switch (name) {
    case 'nickname':
      try {
        BaseSchema.pick({ nickname: true }).parse({ nickname: value });
        return { error: undefined };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { error: error.errors[0]?.message || '닉네임 형식이 올바르지 않습니다' };
        }
        return { error: '알 수 없는 오류가 발생했습니다' };
      }
    case 'email':
      try {
        BaseSchema.pick({ email: true }).parse({ email: value });
        return { error: undefined };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { error: error.errors[0]?.message || '이메일 형식이 올바르지 않습니다' };
        }
        return { error: '알 수 없는 오류가 발생했습니다' };
      }
    case 'password':
      try {
        BaseSchema.pick({ password: true }).parse({ password: value });
        return { error: undefined };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return { error: error.errors[0]?.message || '비밀번호 형식이 올바르지 않습니다' };
        }
        return { error: '알 수 없는 오류가 발생했습니다' };
      }
    case 'checkPassword':
      return value === formData.password
        ? { error: undefined }
        : { error: '비밀번호가 일치하지 않습니다' };
    default:
      return { error: undefined };
  }
};


export const validateLoginSchema = async (data: SignUpSchemaType) => {
  return validateSignUpSchema(data);
};
