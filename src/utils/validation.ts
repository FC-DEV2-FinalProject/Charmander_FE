import { SignUpSchemaType, BaseSchema } from '@/schema/SignUpSchema';
import { ZodError } from 'zod';

export const getFieldDisplayName = (fieldName: string): string => {
  switch (fieldName) {
    case 'nickname':
      return '닉네임';
    case 'email':
      return '이메일';
    case 'password':
      return '비밀번호';
    case 'checkPassword':
      return '비밀번호 확인';
    default:
      return fieldName;
  }
};

export const validateField = (
  name: string,
  value: string,
  formData: SignUpSchemaType
): { error?: string } => {
  if (!value) {
    return {};
  }

  try {
    switch (name) {
      case 'nickname':
        BaseSchema.pick({ nickname: true }).parse({ nickname: value });
        return {};

      case 'email':
        BaseSchema.pick({ email: true }).parse({ email: value });
        return {};

      case 'password':
        BaseSchema.pick({ password: true }).parse({ password: value });
        return {};

      case 'checkPassword':
        if (formData.password !== value) {
          return { error: '비밀번호가 일치하지 않습니다' };
        }
        return {};

      default:
        return {};
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const fieldErrors = error.errors.filter((err) => err.path[0] === name);
      if (fieldErrors.length > 0) {
        return { error: fieldErrors[0].message };
      }
    }
    return {};
  }
};

export const validateRequiredFields = (
  formData: SignUpSchemaType
): Record<string, string | undefined> => {
  const errors: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (!value) {
      errors[key] = `${getFieldDisplayName(key)}을(를) 입력해주세요`;
    }
  }

  return errors;
};

export const hasErrors = (
  errors: Record<string, string | undefined>
): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};

export const formatValidationErrors = (
  result: unknown
): Record<string, string | undefined> => {
  const formattedErrors: Record<string, string | undefined> = {};

  if (
    result &&
    typeof result === 'object' &&
    'error' in result &&
    result.error &&
    typeof result.error === 'object'
  ) {
    Object.entries(result.error).forEach(([key, value]: [string, unknown]) => {
      if (
        value &&
        typeof value === 'object' &&
        '_errors' in value &&
        Array.isArray(value._errors) &&
        value._errors.length > 0
      ) {
        formattedErrors[key] = value._errors[0];
      }
    });
  }

  return formattedErrors;
};
