export let PUBLIC_URL: string;
export let API_URL: string | undefined;
export let MESSAGES_WS_URL: string;
export let SITE_KEY: string;

PUBLIC_URL = process.env.PUBLIC_URL;
API_URL = process.env.REACT_APP_API_URL;
MESSAGES_WS_URL = process.env.REACT_APP_MESSAGES_WS_URL ?? 'wss://localhost:5000';
SITE_KEY = process.env.REACT_APP_SITE_KEY!;
