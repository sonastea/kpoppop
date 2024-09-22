/* eslint-disable prefer-const */
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

const config = {
  thresholds: [
    { l: 's', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 2 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' },
  ],
};

dayjs.extend(relativeTime, config);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%ds',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%d day',
    dd: '%d days',
    M: '%d month',
    MM: '%d months',
    y: '%d year',
    yy: '%d years',
  },
});

export let PUBLIC_URL: string;
export let API_URL: string | undefined;
export let MESSAGES_WS_URL: string;
export let SITE_KEY: string;
export let DAY = dayjs;

PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;
API_URL = import.meta.env.VITE_API_URL;
MESSAGES_WS_URL = import.meta.env.VITE_MESSAGES_WS_URL ?? 'wss://localhost:8080';
SITE_KEY = import.meta.env.VITE_SITE_KEY!;
