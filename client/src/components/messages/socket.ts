import { MESSAGES_WS_URL } from 'Global.d';
import { create } from 'zustand';

type MessagesSocketType = {
  ws: WebSocket | null;
  connect: () => void;
  close: () => void;
};

const MessagesSocket = create<MessagesSocketType>((set) => ({
  ws: null,
  connect: () =>
    set(() => {
      return { ws: new WebSocket(`${MESSAGES_WS_URL}`) };
    }),
  close: () =>
    set((state) => {
      state.ws?.close();
      return { ws: null };
    }),
}));

export default MessagesSocket;
