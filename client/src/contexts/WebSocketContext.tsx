import { PUBLIC_URL } from 'Global.d';
import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io(`${PUBLIC_URL}`, {
  reconnectionAttempts: 3,
  reconnectionDelay: 5000,
  withCredentials: true,
  transports: ['websocket'],
});
export const WebSocketContext = createContext<Socket>(socket);
export const WebSocketProvider = WebSocketContext.Provider;

export function useWebSocket() {
  return useContext(WebSocketContext);
}
