export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  grayDim: '#1A1A1A',
  grayBorder: '#2A2A2A',
  grayMid: '#666666',
  grayLight: '#999999',
} as const;

export const fonts = {
  regular: 'PitchSans-Regular',
  medium: 'PitchSans-Medium',
  mediumItalic: 'PitchSans-MediumItalic',
} as const;

export const fontSize = {
  micro: 10,
  caption: 11,
  body: 13,
  title: 15,
  heading: 22,
  display: 28,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const tracking = {
  tight: -0.2,
  normal: 0,
  loose: 1.4,
  wide: 1.8,
} as const;

export const breakpoints = {
  tablet: 768,
} as const;

export const fontMap = {
  [fonts.regular]: require('../../assets/fonts/PitchSans-Regular.otf'),
  [fonts.medium]: require('../../assets/fonts/PitchSans-Medium.otf'),
  [fonts.mediumItalic]: require('../../assets/fonts/PitchSans-MediumItalic.otf'),
};
