import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  semanticTokens: {
    colors: {
      canvas: { _light: '#F7F7F8', _dark: '#0A0A0A' },
      surface: { _light: '#FFFFFF', _dark: '#141414' },
      surfaceHover: { _light: '#F1F1F3', _dark: '#1A1A1A' },
      inputBg: { _light: '#FFFFFF', _dark: '#0A0A0A' },
      borderDefault: { _light: '#E4E4E7', _dark: '#27272A' },
      borderHover: { _light: '#D4D4D8', _dark: '#3F3F46' },
      borderFocus: { _light: '#18181B', _dark: '#FFFFFF' },
      textPrimary: { _light: '#18181B', _dark: '#FFFFFF' },
      textSecondary: { _light: '#52525B', _dark: '#A1A1AA' },
      textMuted: { _light: '#A1A1AA', _dark: '#52525B' },
      btnSolidBg: { _light: '#18181B', _dark: '#FFFFFF' },
      btnSolidColor: { _light: '#FFFFFF', _dark: '#0A0A0A' },
      btnSolidHover: { _light: '#27272A', _dark: '#E4E4E7' },
      btnSolidActive: { _light: '#3F3F46', _dark: '#D4D4D8' },
    },
  },
  colors: {
    gray: {
      50: '#0A0A0A',
      100: '#141414',
      200: '#1A1A1A',
      300: '#27272A',
      400: '#3F3F46',
      500: '#52525B',
      600: '#71717A',
      700: '#A1A1AA',
      800: '#D4D4D8',
      900: '#FFFFFF',
    },
    surface: {
      bg: '#0A0A0A',
      card: '#141414',
      hover: '#1A1A1A',
      input: '#0A0A0A',
    },
    border: {
      default: '#27272A',
      focus: '#FFFFFF',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      muted: '#52525B',
    },
    status: {
      paid: '#22C55E',
      overdue: '#EAB308',
      open: '#A1A1AA',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'sm',
        transition: 'all 0.15s ease',
      },
      variants: {
        primary: {
          bg: 'btnSolidBg',
          color: 'btnSolidColor',
          _hover: { bg: 'btnSolidHover' },
          _active: { bg: 'btnSolidActive' },
        },
        secondary: {
          bg: 'transparent',
          color: 'textPrimary',
          border: '1px solid',
          borderColor: 'borderDefault',
          _hover: { bg: 'surfaceHover' },
          _active: { bg: 'borderDefault' },
        },
        ghost: {
          bg: 'transparent',
          color: 'textSecondary',
          _hover: { color: 'textPrimary', bg: 'surfaceHover' },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'surface',
          borderRadius: 'sm',
          border: '1px solid',
          borderColor: 'borderDefault',
          boxShadow: 'none',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'inputBg',
          borderColor: 'borderDefault',
          borderRadius: 'sm',
          color: 'textPrimary',
          _placeholder: { color: 'textMuted' },
          _hover: { borderColor: 'borderHover' },
        },
      },
      defaultProps: {
        focusBorderColor: 'borderFocus',
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: 'inputBg',
          borderColor: 'borderDefault',
          borderRadius: 'sm',
          color: 'textPrimary',
          _hover: { borderColor: 'borderHover' },
        },
        icon: {
          color: 'textSecondary',
        },
      },
      defaultProps: {
        focusBorderColor: 'borderFocus',
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          bg: 'inputBg',
          borderColor: 'borderDefault',
          _checked: {
            bg: 'btnSolidBg',
            borderColor: 'btnSolidBg',
            color: 'btnSolidColor',
            _hover: {
              bg: 'btnSolidHover',
              borderColor: 'btnSolidHover',
            },
          },
        },
        label: {
          color: 'textSecondary',
          fontSize: 'sm',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'canvas',
        color: 'textPrimary',
      },
    },
  },
});

export default theme;
