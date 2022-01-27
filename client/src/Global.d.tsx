export var API_URL: string | undefined;
export var SITE_KEY: string;
export var ACCESS_TOKEN: string | undefined;

API_URL = process.env.REACT_APP_API_URL;
SITE_KEY = process.env.REACT_APP_SITE_KEY!;
ACCESS_TOKEN = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
