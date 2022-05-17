export let PUBLIC_URL: string;
export let API_URL: string | undefined;
export let SITE_KEY: string;

PUBLIC_URL = process.env.PUBLIC_URL;
API_URL = process.env.REACT_APP_API_URL;
SITE_KEY = process.env.REACT_APP_SITE_KEY!;
