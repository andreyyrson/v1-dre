import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  InputGroup,
  Input,
  InputRightElement,
  Icon,
  Grid,
  Button,
  Text,
  Flex,
  Box,
} from '@chakra-ui/react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Selecione...' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  function handleSelectDay(day: number) {
    const date = new Date(year, month, day);
    const isoDate = date.toISOString().split('T')[0];
    onChange(isoDate);
    setIsOpen(false);
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const displayDate = value
    ? new Date(value).toLocaleDateString('pt-BR')
    : placeholder;

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  return (
    <Popover isOpen={isOpen} onClose={() => setIsOpen(false)} placement="bottom-start">
      <PopoverTrigger>
        <InputGroup onClick={() => setIsOpen(!isOpen)} cursor="pointer">
          <Input
            value={displayDate}
            readOnly
            color="#FFFFFF"
            cursor="pointer"
            placeholder={placeholder}
          />
          <InputRightElement>
            <Icon as={FiCalendar} color="#A1A1AA" />
          </InputRightElement>
        </InputGroup>
      </PopoverTrigger>
      <PopoverContent
        bg="#141414"
        border="1px solid #27272A"
        borderRadius="sm"
        boxShadow="0 4px 20px rgba(0,0,0,0.5)"
        w="280px"
      >
        <PopoverBody p={3}>
          <Flex justify="space-between" align="center" mb={3}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); prevMonth(); }}
              color="#A1A1AA"
              _hover={{ color: '#FFFFFF', bg: '#1A1A1A' }}
            >
              <Icon as={FiChevronLeft} />
            </Button>
            <Text color="#FFFFFF" fontWeight="600" fontSize="sm">
              {monthNames[month]} {year}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); nextMonth(); }}
              color="#A1A1AA"
              _hover={{ color: '#FFFFFF', bg: '#1A1A1A' }}
            >
              <Icon as={FiChevronRight} />
            </Button>
          </Flex>

          <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2}>
            {weekDays.map((d) => (
              <Text key={d} color="#52525B" fontSize="10px" textAlign="center" fontWeight="600">
                {d}
              </Text>
            ))}
          </Grid>

          <Grid templateColumns="repeat(7, 1fr)" gap={1}>
            {days.map((day, i) =>
              day === null ? (
                <Box key={`empty-${i}`} h="32px" />
              ) : (
                <Button
                  key={day}
                  size="sm"
                  h="32px"
                  fontSize="13px"
                  fontWeight="500"
                  variant="ghost"
                  bg={isSelected(day) ? '#FFFFFF' : 'transparent'}
                  color={isSelected(day) ? '#0A0A0A' : '#A1A1AA'}
                  _hover={{ bg: isSelected(day) ? '#E4E4E7' : '#1A1A1A', color: '#FFFFFF' }}
                  borderRadius="sm"
                  onClick={(e) => { e.stopPropagation(); handleSelectDay(day); }}
                >
                  {day}
                </Button>
              )
            )}
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
