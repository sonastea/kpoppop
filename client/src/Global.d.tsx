export let API_URL: string | undefined;
export let SITE_KEY: string;

API_URL = process.env.REACT_APP_API_URL;
SITE_KEY = process.env.REACT_APP_SITE_KEY!;
