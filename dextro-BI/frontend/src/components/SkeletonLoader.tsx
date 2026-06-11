import { Box, Skeleton, Stack } from '@chakra-ui/react';

interface SkeletonTableProps {
  count?: number;
}

export const SkeletonRow = ({ height = '20px' }: { height?: string }) => {
  return (
    <Box display="flex" gap={4} py={3} px={4} borderBottom="1px solid #27272A">
      <Skeleton height={height} width="40px" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
      <Skeleton height={height} width="30%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
      <Skeleton height={height} width="20%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
      <Skeleton height={height} width="15%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
      <Skeleton height={height} width="25%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
    </Box>
  );
};

export const SkeletonCard = () => {
  return (
    <Box p={6} bg="#141414" borderRadius="sm" border="1px solid #27272A">
      <Stack spacing={4}>
        <Skeleton height="24px" width="40%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
        <Skeleton height="48px" width="60%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
      </Stack>
    </Box>
  );
};

export const SkeletonKpi = () => {
  return (
    <Box p={5} bg="#141414" borderRadius="sm" border="1px solid #27272A">
      <Stack spacing={3}>
        <Skeleton height="16px" width="30%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
        <Skeleton height="32px" width="50%" borderRadius="sm" startColor="#1A1A1A" endColor="#27272A" />
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
