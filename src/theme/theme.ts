export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  grayDim: '#1A1A1A',
  grayBorder: '#2A2A2A',
  grayMid: '#666666',
  grayLight: '#999999',
} as const;

// All text in the app resolves to Haltung Light.
// All fonts.* tokens point at the same family so existing components
// don't need to change. Italic is registered separately for any
// future italic usage.
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
  'Haltung-Light': require('../../assets/fonts/Haltung-Light.otf'),
  'Haltung-LightItalic': require('../../assets/fonts/Haltung-LightItalic.otf'),
};
