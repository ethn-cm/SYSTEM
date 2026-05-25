export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  grayDim: '#1A1A1A',
  grayBorder: '#2A2A2A',
  grayMid: '#666666',
  grayLight: '#999999',
} as const;

export const fonts = {
  // Pitch Sans — body/UI typeface
  regular: 'PitchSans-Regular',
  medium: 'PitchSans-Medium',
  mediumItalic: 'PitchSans-MediumItalic',
  // Idlewild — display typeface
  displayThin: 'Idlewild-Thin',
  displayLight: 'Idlewild-Light',
  displayBook: 'Idlewild-Book',
  displayMedium: 'Idlewild-Medium',
  displayBold: 'Idlewild-Bold',
} as const;

export const fontSize = {
  micro: 12,
  caption: 12,
  body: 12,
  title: 12,
  heading: 12,
  display: 12,
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
  tight: 0,
  normal: 0,
  loose: 0,
  wide: 0,
} as const;

export const breakpoints = {
  tablet: 768,
} as const;

export const fontMap = {
  [fonts.regular]: require('../../assets/fonts/PitchSans/PitchSans-Regular.otf'),
  [fonts.medium]: require('../../assets/fonts/PitchSans/PitchSans-Medium.otf'),
  [fonts.mediumItalic]: require('../../assets/fonts/PitchSans/PitchSans-MediumItalic.otf'),
  [fonts.displayThin]: require('../../assets/fonts/Idlewild/Idlewild-Thin.otf'),
  [fonts.displayLight]: require('../../assets/fonts/Idlewild/Idlewild-Light.otf'),
  [fonts.displayBook]: require('../../assets/fonts/Idlewild/Idlewild-Book.otf'),
  [fonts.displayMedium]: require('../../assets/fonts/Idlewild/Idlewild-Medium.otf'),
  [fonts.displayBold]: require('../../assets/fonts/Idlewild/Idlewild-Bold.otf'),
};
