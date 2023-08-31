import { format } from 'date-fns';

export const dateFilter = (value: Date, dateFormat: string = 'yyyy-MM-dd') => format(value, dateFormat);

export const dateTimeFilter = (value: Date, dateTimeFormat: string = 'yyyy-MM-dd HH:mm') => dateFilter(value, dateTimeFormat);
