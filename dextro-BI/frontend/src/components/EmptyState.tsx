import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface EmptyStateProps {
  icon?: 'inbox' | 'search' | 'refresh';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <Box
      textAlign="center"
      py={12}
      px={4}
    >
      <Heading size="md" color="textSecondary" mb={2} fontWeight="500">
        {title}
      </Heading>
      <Text color="textMuted" maxW="md" mx="auto" mb={6} fontSize="sm">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
