import { Box, Skeleton, Stack } from '@chakra-ui/react';

interface SkeletonTableProps {
  count?: number;
}

export const SkeletonRow = ({ height = '20px' }: { height?: string }) => {
  return (
    <Box display="flex" gap={4} py={3} px={4}>
      <Skeleton height={height} width="40px" borderRadius="md" />
      <Skeleton height={height} width="30%" borderRadius="md" />
      <Skeleton height={height} width="20%" borderRadius="md" />
      <Skeleton height={height} width="15%" borderRadius="md" />
      <Skeleton height={height} width="25%" borderRadius="md" />
    </Box>
  );
};

export const SkeletonCard = () => {
  return (
    <Box p={6} bg="white" borderRadius="xl" boxShadow="md">
      <Stack spacing={4}>
        <Skeleton height="24px" width="40%" borderRadius="md" />
        <Skeleton height="48px" width="60%" borderRadius="md" />
      </Stack>
    </Box>
  );
};

export const SkeletonKpi = () => {
  return (
    <Box p={6} bg="white" borderRadius="xl" boxShadow="md">
      <Stack spacing={4}>
        <Skeleton height="20px" width="30%" borderRadius="md" />
        <Skeleton height="40px" width="50%" borderRadius="md" />
      </Stack>
    </Box>
  );
};

export const SkeletonTable = ({ count = 5 }: SkeletonTableProps) => {
  return (
    <Stack spacing={0}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </Stack>
  );
};
