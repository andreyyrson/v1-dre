import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  colors: {
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
          bg: '#FFFFFF',
          color: '#0A0A0A',
          _hover: { bg: '#E4E4E7' },
          _active: { bg: '#D4D4D8' },
        },
        secondary: {
          bg: 'transparent',
          color: '#FFFFFF',
          border: '1px solid #27272A',
          _hover: { bg: '#1A1A1A' },
          _active: { bg: '#27272A' },
        },
        ghost: {
          bg: 'transparent',
          color: '#A1A1AA',
          _hover: { color: '#FFFFFF', bg: 'transparent' },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Card: {
      baseStyle: {
        bg: '#141414',
        borderRadius: 'sm',
        border: '1px solid #27272A',
        boxShadow: 'none',
      },
    },
    Input: {
      baseStyle: {
        bg: '#0A0A0A',
        borderColor: '#27272A',
        borderRadius: 'sm',
        color: '#FFFFFF',
        _placeholder: { color: '#52525B' },
      },
      defaultProps: {
        focusBorderColor: '#FFFFFF',
      },
    },
    Select: {
      baseStyle: {
        bg: '#0A0A0A',
        borderColor: '#27272A',
        borderRadius: 'sm',
        color: '#FFFFFF',
      },
      defaultProps: {
        focusBorderColor: '#FFFFFF',
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          bg: '#0A0A0A',
          borderColor: '#27272A',
          _checked: {
            bg: '#FFFFFF',
            borderColor: '#FFFFFF',
            color: '#0A0A0A',
          },
        },
        label: {
          color: '#A1A1AA',
          fontSize: 'sm',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: '#0A0A0A',
        color: '#FFFFFF',
      },
    },
  },
});

export default theme;
