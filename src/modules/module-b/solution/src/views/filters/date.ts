import { format } from 'date-fns';

export const dateFilter = (value: Date, dateFormat: string = 'dd.MM.yyyy') => format(value, dateFormat);

export const dateTimeFilter = (value: Date, dateTimeFormat: string = 'dd.MM.yyyy HH:mm') => dateFilter(value, dateTimeFormat);
