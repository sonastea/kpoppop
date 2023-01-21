export {};

declare module 'express-session' {
  interface SessionData {
    passport: {
      user?: {
        id?: number;
        role?: string;
        discordId?: string;
      };
    };
  }
}

declare module 'socket.io' {
  interface Socket {
    sessionID?: string;
    user?: {
        id?: number;
        role?: string;
        discordId?: string;
    }
  }
}
