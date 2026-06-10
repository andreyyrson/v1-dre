import { Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiInbox, FiSearch, FiRefreshCw } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionButton = motion(Button);

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'refresh';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const iconMap = {
  inbox: FiInbox,
  search: FiSearch,
  refresh: FiRefreshCw,
};

export const EmptyState = ({ icon = 'inbox', title, description, actionLabel, onAction }: EmptyStateProps) => {
  const IconComponent = iconMap[icon];

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      textAlign="center"
      py={12}
      px={4}
    >
      <MotionBox
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity 
        }}
        display="inline-block"
        mb={6}
      >
        <Icon as={IconComponent} boxSize={16} color="gray.300" />
      </MotionBox>
      <Heading size="lg" color="gray.700" mb={2}>
        {title}
      </Heading>
      <Text color="gray.500" maxW="md" mx="auto" mb={6}>
        {description}
      </Text>
      {actionLabel && onAction && (
        <MotionButton
          colorScheme="primary"
          size="lg"
          onClick={onAction}
          leftIcon={<Icon as={icon === 'search' ? FiSearch : FiRefreshCw} />}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionLabel}
        </MotionButton>
      )}
    </MotionBox>
  );
};

export default EmptyState;
