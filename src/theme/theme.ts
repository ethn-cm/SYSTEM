export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  grayDim: '#1A1A1A',
  grayBorder: '#2A2A2A',
  grayMid: '#666666',
  grayLight: '#999999',
} as const;

// All text resolves to Haltung Light.
const HALTUNG = 'Haltung-Light';

export const fonts = {
  regular: HALTUNG,
  medium: HALTUNG,
  mediumItalic: 'Haltung-LightItalic',
  displayThin: HALTUNG,
  displayLight: HALTUNG,
  displayBook: HALTUNG,
  displayMedium: HALTUNG,
  displayBold: HALTUNG,
} as const;

// Two-tier hierarchy in the Teenage Engineering style:
// small body/labels (12) and large primary labels (22).
export const fontSize = {
  micro: 12,
  caption: 12,
  body: 12,
  title: 22,
  heading: 22,
  display: 22,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

// 1% of base font size (12). Subtle, matches TE-style natural spacing.
const ONE_PERCENT = 0.12;
export const tracking = {
  tight: ONE_PERCENT,
  normal: ONE_PERCENT,
  loose: ONE_PERCENT,
  wide: ONE_PERCENT,
} as const;

export const breakpoints = {
  tablet: 768,
} as const;

export const fontMap = {
  'Haltung-Light': require('../../assets/fonts/Haltung-Light.otf'),
  'Haltung-LightItalic': require('../../assets/fonts/Haltung-LightItalic.otf'),
};
