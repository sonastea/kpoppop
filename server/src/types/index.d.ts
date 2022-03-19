export {};

declare module 'express-session' {
  interface SessionData {
    passport: {
      user: {
        id: number;
        role: string;
      };
    };
  }
}
