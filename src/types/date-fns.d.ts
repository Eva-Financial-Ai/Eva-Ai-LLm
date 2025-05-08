// Type definitions for date-fns 2.30.0
// Project: https://github.com/date-fns/date-fns
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string, options?: object): string;
  export function formatDistance(date: Date | number, baseDate: Date | number, options?: object): string;
  export function formatDistanceToNow(date: Date | number, options?: object): string;
  export function formatRelative(date: Date | number, baseDate: Date | number, options?: object): string;
  
  // Date manipulation
  export function addDays(date: Date | number, amount: number): Date;
  export function addHours(date: Date | number, amount: number): Date;
  export function addMinutes(date: Date | number, amount: number): Date;
  export function addMonths(date: Date | number, amount: number): Date;
  export function addQuarters(date: Date | number, amount: number): Date;
  export function addSeconds(date: Date | number, amount: number): Date;
  export function addWeeks(date: Date | number, amount: number): Date;
  export function addYears(date: Date | number, amount: number): Date;
  
  export function subDays(date: Date | number, amount: number): Date;
  export function subHours(date: Date | number, amount: number): Date;
  export function subMinutes(date: Date | number, amount: number): Date;
  export function subMonths(date: Date | number, amount: number): Date;
  export function subQuarters(date: Date | number, amount: number): Date;
  export function subSeconds(date: Date | number, amount: number): Date;
  export function subWeeks(date: Date | number, amount: number): Date;
  export function subYears(date: Date | number, amount: number): Date;
  
  // Date comparison
  export function differenceInCalendarDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInCalendarYears(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInHours(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMinutes(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInMonths(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInQuarters(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInSeconds(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInWeeks(dateLeft: Date | number, dateRight: Date | number): number;
  export function differenceInYears(dateLeft: Date | number, dateRight: Date | number): number;
  
  // Date comparison operators
  export function isAfter(date: Date | number, dateToCompare: Date | number): boolean;
  export function isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  export function isEqual(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameHour(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameMinute(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameMonth(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameQuarter(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameSecond(dateLeft: Date | number, dateRight: Date | number): boolean;
  export function isSameWeek(dateLeft: Date | number, dateRight: Date | number, options?: object): boolean;
  export function isSameYear(dateLeft: Date | number, dateRight: Date | number): boolean;
  
  // Date parsing
  export function parse(dateString: string, formatString: string, referenceDate: Date | number, options?: object): Date;
  export function parseISO(argument: string, options?: object): Date;
  
  // Date utilities
  export function closestIndexTo(dateToCompare: Date | number, datesArray: Array<Date | number>): number;
  export function closestTo(dateToCompare: Date | number, datesArray: Array<Date | number>): Date;
  export function fromUnixTime(unixTime: number): Date;
  export function getTime(date: Date | number): number;
  export function getUnixTime(date: Date | number): number;
  export function max(datesArray: Array<Date | number>): Date;
  export function min(datesArray: Array<Date | number>): Date;
  export function startOfDay(date: Date | number): Date;
  export function startOfMonth(date: Date | number): Date;
  export function startOfWeek(date: Date | number, options?: object): Date;
  export function startOfYear(date: Date | number): Date;
} 