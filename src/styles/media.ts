import { css, type CSSObject, type Interpolation } from 'styled-components';

export type Breakpoints = 'small' | 'medium' | 'large' | 'xlarge';

export const breakpoints: Record<Breakpoints, string> = {
  small: '@media (max-width: 639px)',
  medium: '@media (max-width: 1047px)',
  large: '@media (max-width: 1599px)',
  xlarge: '@media (min-width: 1600px)',
};

const media = Object.entries(breakpoints).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<object>[]
    ) => css`
      ${value} {
        ${css(first, ...interpolations)}
      }
    `,
  }),
  {} as Record<
    Breakpoints,
    (
      // eslint-disable-next-line no-unused-vars
      first: CSSObject | TemplateStringsArray,
      // eslint-disable-next-line no-unused-vars
      ...interpolations: Interpolation<object>[]
    ) => ReturnType<typeof css>
  >
);

export default media;
