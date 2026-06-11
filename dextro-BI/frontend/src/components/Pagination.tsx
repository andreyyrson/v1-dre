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
      bg="#141414"
      borderRadius="sm"
      border="1px solid #27272A"
      wrap="wrap"
      gap={3}
    >
      <HStack spacing={2}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          isDisabled={page <= 1}
          color={page <= 1 ? '#52525B' : '#A1A1AA'}
          _hover={page <= 1 ? {} : { bg: '#1A1A1A', color: '#FFFFFF' }}
          leftIcon={<FiChevronLeft />}
        >
          Anterior
        </Button>

        <Text color="#A1A1AA" fontSize="sm" fontWeight="500">
          Página{' '}
          <Text as="span" color="#FFFFFF" fontWeight="700">
            {page}
          </Text>{' '}
          de{' '}
          <Text as="span" color="#FFFFFF" fontWeight="700">
            {totalPages}
          </Text>
        </Text>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page >= totalPages}
          color={page >= totalPages ? '#52525B' : '#A1A1AA'}
          _hover={page >= totalPages ? {} : { bg: '#1A1A1A', color: '#FFFFFF' }}
          rightIcon={<FiChevronRight />}
        >
          Próxima
        </Button>
      </HStack>

      <HStack spacing={3}>
        <Text color="#A1A1AA" fontSize="sm">
          {total} total
        </Text>
        <Select
          size="sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          bg="#0A0A0A"
          color="#FFFFFF"
          border="1px solid #27272A"
          borderRadius="sm"
          w="100px"
          _hover={{ borderColor: '#3F3F46' }}
          fontSize="sm"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt} style={{ background: '#0A0A0A', color: '#FFFFFF' }}>
              {opt} / pág
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  );
}
