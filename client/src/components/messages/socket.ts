import { MESSAGES_WS_URL } from 'Global.d';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

type MessagesSocketType = {
  ws: Socket | null;
  connect: (id: number | undefined) => void;
  close: () => void;
};

const MessagesSocket = create<MessagesSocketType>((set) => ({
  ws: null,
  connect: (id: number | undefined) =>
    set({
      ws: io(`${MESSAGES_WS_URL}`, {
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        withCredentials: true,
        auth: { id: id ?? 0 },
        transports: ['websocket'],
      }),
    }),
  close: () =>
    set((state) => ({
      ws: state.ws?.close(),
    })),
}));

export default MessagesSocket;
