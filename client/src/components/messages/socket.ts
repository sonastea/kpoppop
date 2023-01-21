import { PUBLIC_URL } from 'Global.d';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

type MessagesSocketType = {
  ws: Socket | null;
  connect: (id: number | undefined) => void;
};

const MessagesSocket = create<MessagesSocketType>((set) => ({
  ws: null,
  connect: (id: number | undefined) =>
    set({
      ws: io(`${PUBLIC_URL}`, {
        reconnectionAttempts: 3,
        reconnectionDelay: 5000,
        withCredentials: true,
        auth: { id: id ?? 0 },
      }),
    }),
}));

export default MessagesSocket;
