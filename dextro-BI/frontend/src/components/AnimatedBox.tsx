import { Box, BoxProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface AnimatedBoxProps extends BoxProps {
  delay?: number;
  duration?: number;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const scaleUp = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export const AnimatedBox = ({ children, delay = 0, duration = 0.3, variant = 'fadeIn', ...props }: AnimatedBoxProps & { variant?: 'fadeIn' | 'scaleUp' }) => {
  const animation = variant === 'fadeIn' ? fadeIn : scaleUp;

  return (
    <MotionBox
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export default AnimatedBox;
