import { 
  getYear, 
  add as addDateFns, 
  isAfter, 
  isWithinInterval, 
  isBefore, 
  isSameDay as isSameDayDateFns,
  parseISO 
} from "date-fns";
import { DATE_UNIT_TYPES } from "./constants";

export function getCurrentYear(): number {
  return getYear(new Date());
}

export function add(date: any, amount: any, type: string = DATE_UNIT_TYPES.DAYS): Date {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided');
  }
  
  const duration: Record<string, number> = {};
  duration[type] = amount;
  
  return addDateFns(date, duration);
}

export function isWithinRange(date: Date | string, from: Date | string, to: Date | string): boolean {
  const fromDate = typeof from === 'string' ? parseISO(from) : from;
  const toDate = typeof to === 'string' ? parseISO(to) : to;
  
  if (isAfter(fromDate, toDate)) {
    throw new Error('Invalid range: from date must be before to date');
  }
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isAfter(dateObj, fromDate) && isBefore(dateObj, toDate)) {
    return true;
  }
  
  return false;
}

export function isDateBefore(date: Date | string, compareDate: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const compareDateObj = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
  return isBefore(dateObj, compareDateObj);
}

export function isSameDay(date: Date | string, compareDate: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const compareDateObj = typeof compareDate === 'string' ? parseISO(compareDate) : compareDate;
  return isSameDayDateFns(dateObj, compareDateObj);
}

export async function getHolidays(year: number): Promise<Date[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        new Date(year, 0, 1),   // New Year's Day
        new Date(year, 11, 25), // Christmas
        new Date(year, 11, 31), // New Year's Eve
      ]);
    }, 100);
  });
}

export async function isHoliday(date: Date): Promise<boolean> {
  const holidays = await getHolidays(date.getFullYear());
  return holidays.some(holiday => isSameDay(date, holiday));
}


