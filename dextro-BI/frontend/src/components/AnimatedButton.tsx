import { Button, ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

interface AnimatedButtonProps extends ButtonProps {
  delay?: number;
}

export const AnimatedButton = ({ children, delay = 0, ...props }: AnimatedButtonProps) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 17,
        duration: 0.3, 
        delay 
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default AnimatedButton;
