import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%s ago',
    m: '%dm',
    mm: '%dm',
    h: '%dh',
    hh: '%dh',
    d: '%dd',
    dd: '%dd',
    M: '%dm',
    MM: '%dm',
    y: '%dy',
    yy: '%dy',
  },
});

export let PUBLIC_URL: string;
export let API_URL: string | undefined;
export let MESSAGES_WS_URL: string;
export let SITE_KEY: string;
export let DAY = dayjs;

PUBLIC_URL = process.env.PUBLIC_URL;
API_URL = process.env.REACT_APP_API_URL;
MESSAGES_WS_URL = process.env.REACT_APP_MESSAGES_WS_URL ?? 'wss://localhost:5000';
SITE_KEY = process.env.REACT_APP_SITE_KEY!;
