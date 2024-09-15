import { device, Theme } from '@aplinkosministerija/design-system';
import { createGlobalStyle } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

export enum ProfileSelectorVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
}

export enum ButtonVariants {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  TERTIARY = 'tertiary',
  DANGER = 'danger',
  DANGER_OUTLINE = 'dangerOutline',
  TRANSPARENT = 'transparent',
  ACCENT = 'accent',
}

export const palette = {
  primary: '#2671D9',
  secondary: '#006E82',
  tertiary: '#6EB4BE',
  accent: '#f89572',
  red: '#FE5B78',
  green: '#4FB922',
  brightBlue: '#13C9E78F',
  steelBlue: '#7A7E9F',
  graphite: '#231F20',
  midnightBlue: '#121A55',
  transparent: 'transparent',
  white: '#FFFFFF',
  charcoalBlue: '#4B5565',
  ghostWhite: '#F7F8FA',
  oldLace: '#FDF5EF',
  aliceBlue: '#EDF1F2',
  background: '#f8fafc',
};

export const theme: Theme = {
  colors: {
    primary: palette.primary,
    secondary: '#C7E6DC',
    tertiary: '#73DC8C',
    transparent: 'transparent',
    label: '#4B5565',
    danger: '#FE5B78',
    success: '#258800',
    powder: '#FFFFFFCC',
    purple: '#8a33fe',
    purpleBrighter: '#b020a2',
    yellow: '#ffb400',
    yellowDarker: '#ffd399',
    greyDarker: '#d4d5de',
    lightSteelBlue: '#cdd5df',
    buttons: {
      primary: {
        background: palette.primary,
        hover: palette.primary,
        text: 'white',
        border: palette.primary,
      },
      secondary: {
        background: palette.primary,
        text: '#101010',
        border: 'white',
        hover: 'white',
      },
      tertiary: {
        background: '#73DC8C',
        text: 'white',
        border: '#73DC8C',
        hover: '#73DC8C',
      },
      success: {
        background: '#258800',
        text: 'white',
        border: '#258800',
        hover: '#258800',
      },
      danger: {
        background: '#FE5B78',
        text: 'white',
        border: '#FE5B78',
        hover: '#FE5B78',
      },
      transparent: {
        background: 'transparent',
        text: palette.primary,
        border: palette.primary,
        hoverText: palette.primary,
        hover: 'transparent',
      },
    },
    fields: {
      text: '#101010',
      label: '#101010',
      border: '#d4d5de',
      borderFocus: palette.primary,
      background: 'white',
    },

    text: {
      primary: '#121926',
      secondary: '#535D6C',
      tertiary: '#4B5565',
      label: '#697586',
      error: '#FE5B78',
      labels: '#697586',
      input: '#231f20',
      accent: '#102EB1',
      powder: '#FFFFFFCC',
      retroBlack: '#101010',
      royalBlue: '#1121DA',
    },
    border: '#CDD5DF',
    background: '#F7F9FB',
    cardBackground: { primary: '#f7f7f7', success: '#eafbf6' },
    GREY: '#f7f7f7',
  },
  radius: {
    buttons: 3,
    fields: 0.4,
    multiSelectFieldTag: 0.4,
  },
  height: {
    fields: 4,
    buttons: 4,
  },
  fontSize: {
    fields: 0,
    fieldLabels: 0,
    buttons: 0,
  },
  fontWeight: {
    fields: 0,
    fieldLabels: 0,
    buttons: 0,
  },
};

export const GlobalStyle = createGlobalStyle`

  #root {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    background-color: ${palette.background};

    @media ${device.mobileL} {
      flex-direction: column;
    }
  }

  *{
    box-sizing: border-box;
    font-family: 'Muli', 'Manrope', sans-serif !important;
  }
  html { 
    font-size: 62.5%; 
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 1.6rem;
    overflow: hidden;
    width: 100%;
    height: 100%;
    position: fixed;
  } 

  a {
    text-decoration: none;
    color: inherit;
    :hover{
      color: inherit;
    }
  }
  button {
    outline: none;
    text-decoration: none;
    display: block;
    border: none;
    background-color: transparent;
  }

  textarea {
    font-size: 1.6rem;
  }


`;
