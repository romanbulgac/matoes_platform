import { parseISO } from 'date-fns';

/**
 * Парсит ISO строку даты/времени в локальный Date объект
 * Использует parseISO из date-fns для корректной обработки строк без timezone
 * 
 * @param isoString - ISO 8601 строка даты/времени (например: "2025-10-15T08:00:00")
 * @returns Date объект в локальном времени
 */
export const parseScheduledDate = (isoString: string): Date => {
  return parseISO(isoString);
};

/**
 * Безопасно получает timestamp для сравнения дат
 * 
 * @param isoString - ISO 8601 строка даты/времени
 * @returns Timestamp в миллисекундах
 */
export const getScheduledTimestamp = (isoString: string): number => {
  return parseISO(isoString).getTime();
};
