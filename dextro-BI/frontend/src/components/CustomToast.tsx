import { Box, Text, Icon, CloseButton } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const MotionBox = motion(Box);

interface CustomToastProps {
  status: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  onClose: () => void;
}

const statusConfig = {
  success: {
    icon: FiCheckCircle,
    bg: 'success.500',
    iconColor: 'white',
  },
  error: {
    icon: FiAlertCircle,
    bg: 'error.500',
    iconColor: 'white',
  },
  info: {
    icon: FiInfo,
    bg: 'info.500',
    iconColor: 'white',
  },
  warning: {
    icon: FiAlertCircle,
    bg: 'warning.500',
    iconColor: 'white',
  },
};

export const CustomToast = ({ status, title, description, onClose }: CustomToastProps) => {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        bg={config.bg}
        color="white"
        p={4}
        borderRadius="md"
        boxShadow="lg"
        display="flex"
        alignItems="flex-start"
        minW="300px"
        maxW="400px"
      >
        <Icon as={StatusIcon} boxSize={5} mr={3} mt={0.5} />
        <Box flex={1}>
          <Text fontWeight="medium" fontSize="sm">
            {title}
          </Text>
          {description && (
            <Text fontSize="xs" mt={1} opacity={0.9}>
              {description}
            </Text>
          )}
        </Box>
        <CloseButton
          size="sm"
          onClick={onClose}
          color="white"
          _hover={{ bg: 'whiteAlpha.200' }}
        />
      </MotionBox>
    </AnimatePresence>
  );
};

export default CustomToast;
