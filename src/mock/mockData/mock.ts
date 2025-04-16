import type { BannerSliderType } from '@/types/types';
import loginBanner1 from '@/assets/loginBanner/aivatar메인1.png';

export const loginBanner = (): BannerSliderType => {
  const images = [loginBanner1];
  return { images };
};
