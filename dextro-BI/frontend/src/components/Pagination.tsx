import { Flex, Button, Text, Select, HStack } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pageSizeOptions = [10, 25, 50, 100];

  return (
    <Flex
      justify="space-between"
      align="center"
      mt={4}
      px={2}
      py={3}
      bg="surface"
      borderRadius="sm"
      border="1px solid"
      borderColor="borderDefault"
      wrap="wrap"
      gap={3}
    >
      <HStack spacing={2}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          isDisabled={page <= 1}
          color={page <= 1 ? 'textMuted' : 'textSecondary'}
          _hover={page <= 1 ? {} : { bg: 'surfaceHover', color: 'textPrimary' }}
          leftIcon={<FiChevronLeft />}
        >
          Anterior
        </Button>

        <Text color="textSecondary" fontSize="sm" fontWeight="500">
          Página{' '}
          <Text as="span" color="textPrimary" fontWeight="700">
            {page}
          </Text>{' '}
          de{' '}
          <Text as="span" color="textPrimary" fontWeight="700">
            {totalPages}
          </Text>
        </Text>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page >= totalPages}
          color={page >= totalPages ? 'textMuted' : 'textSecondary'}
          _hover={page >= totalPages ? {} : { bg: 'surfaceHover', color: 'textPrimary' }}
          rightIcon={<FiChevronRight />}
        >
          Próxima
        </Button>
      </HStack>

      <HStack spacing={3}>
        <Text color="textSecondary" fontSize="sm">
          {total} total
        </Text>
        <Select
          size="sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          w="100px"
          fontSize="sm"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / pág
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  );
}
