export const colors = {
  black: '#000000',
  white: '#FFFFFF',
  grayDim: '#1A1A1A',
  grayBorder: '#2A2A2A',
  grayMid: '#666666',
  grayLight: '#999999',
} as const;

// All type across the app uses the same font (Univers Next Pro Extra Light
// from Adobe Fonts, loaded via Typekit on web) at the same size. Hierarchy
// comes from tracking, spacing, and color alone.
const UNIVERSAL_FONT = 'univers-next-pro';
const UNIVERSAL_SIZE = 14;

export const fonts = {
  regular: UNIVERSAL_FONT,
  medium: UNIVERSAL_FONT,
  mediumItalic: UNIVERSAL_FONT,
  displayThin: UNIVERSAL_FONT,
  displayLight: UNIVERSAL_FONT,
  displayBook: UNIVERSAL_FONT,
  displayMedium: UNIVERSAL_FONT,
  displayBold: UNIVERSAL_FONT,
  univers: UNIVERSAL_FONT,
} as const;

export const fontSize = {
  micro: UNIVERSAL_SIZE,
  caption: UNIVERSAL_SIZE,
  body: UNIVERSAL_SIZE,
  title: UNIVERSAL_SIZE,
  heading: UNIVERSAL_SIZE,
  display: UNIVERSAL_SIZE,
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

// Empty — useFonts resolves immediately. Local .otf files remain on disk
// in assets/fonts/ for when you want to bundle Univers Next Pro for native.
export const fontMap = {};
