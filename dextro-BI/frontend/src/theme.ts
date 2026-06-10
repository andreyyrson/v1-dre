import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  colors: {
    primary: {
      50: '#FAF5FF',
      100: '#E9D8FD',
      200: '#D6BCFA',
      300: '#B794F4',
      400: '#9F7AEA',
      500: '#805AD5',
      600: '#6B46C1',
      700: '#553C9A',
      800: '#44337A',
      900: '#322659',
    },
    success: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9AE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#22543D',
      900: '#1C4532',
    },
    error: {
      50: '#FFF5F5',
      100: '#FED7D7',
      200: '#FEB2B2',
      300: '#FC8181',
      400: '#F56565',
      500: '#E53E3E',
      600: '#C53030',
      700: '#9B2C2C',
      800: '#822727',
      900: '#63171B',
    },
    info: {
      50: '#EBF8FF',
      100: '#BEE3F8',
      200: '#90CDF4',
      300: '#63B3ED',
      400: '#4299E1',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#2C5282',
      800: '#2A4365',
      900: '#1A365D',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'md',
        transition: 'all 0.2s ease',
      },
    },
    Card: {
      baseStyle: {
        borderRadius: 'xl',
        boxShadow: 'md',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
      baseStyle: {
        borderRadius: 'md',
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'primary.500',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme;
