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
  SUCCESS = 'success',
  DANGER = 'danger',
  TRANSPARENT = 'transparent',
  OUTLINE = 'outline',
}

export const palette = {
  primary: '#2671D9',
  secondary: '#C7E6DC',
  tertiary: '#73DC8C',
  danger: '#FE5B78',
  success: '#258800',
  yellow: '#ffb400',
  yellowDarker: '#ffd399',
  purple: '#8a33fe',
  purpleBrighter: '#b020a2',
  transparent: 'transparent',
  white: '#FFFFFF',
  background: '#f8fafc',
  lightblue: '#E5EEFBFF',
  greyLighter: '#E5E7EB',
  greyDarker: '#d4d5de',
};

export const theme: Theme = {
  colors: {
    ...palette,
    border: palette.greyLighter,
    link: palette.primary,
    buttons: {
      [ButtonVariants.PRIMARY]: {
        background: palette.primary,
        hover: palette.primary,
        text: palette.white,
        border: palette.primary,
      },
      [ButtonVariants.SECONDARY]: {
        background: palette.primary,
        text: '#101010',
        border: palette.white,
        hover: palette.white,
      },
      [ButtonVariants.TERTIARY]: {
        background: '#73DC8C',
        text: 'white',
        border: '#73DC8C',
        hover: '#73DC8C',
      },
      [ButtonVariants.SUCCESS]: {
        background: '#258800',
        text: 'white',
        border: '#258800',
        hover: '#258800',
      },
      [ButtonVariants.DANGER]: {
        background: '#FE5B78',
        text: 'white',
        border: '#FE5B78',
        hover: '#FE5B78',
      },
      [ButtonVariants.TRANSPARENT]: {
        background: 'transparent',
        text: palette.primary,
        border: palette.primary,
        hoverText: palette.primary,
        hover: 'transparent',
      },
      [ButtonVariants.OUTLINE]: {
        background: 'transparent',
        text: palette.primary,
        border: palette.greyDarker,
        checked: palette.lightblue,
        checkedBorder: palette.primary,
        checkedText: palette.primary,
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
  },
  radius: {
    buttons: 3,
    fields: 0.4,
    multiSelectFieldTag: 0.4,
    checkBoxButton: 0.4,
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
  padding: {
    buttonMultiSelect: 0,
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
