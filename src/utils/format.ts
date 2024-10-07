import { format } from 'date-fns';

export const formatDate = (date?: Date) => (date ? format(new Date(date), 'yyyy-MM-dd') : '-');

export const formatTime = (date?: Date) => (date ? format(new Date(date), 'HH:mm:ss') + 'Z' : '-');

export const formatDateAndTime = (datetime: Date | string) =>
  datetime ? format(new Date(datetime), 'yyyy-MM-dd HH:mm') : '-';
