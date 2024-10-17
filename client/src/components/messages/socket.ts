import { MESSAGES_WS_URL } from 'Global.d';
import { create } from 'zustand';

type MessagesSocketType = {
  reconnectAttempts: number;
  reconnecting: boolean;
  resetAttempts: () => void;
  ws: WebSocket | null;
  connect: () => void;
  close: () => void;
  reconnect: () => void;
};

const INITIAL_RECONNECT_INTERVAL = 1000; // 1 second in milliseconds
const MAX_RECONNECT_INTERVAL = 30000; // 30 seconds in milliseconds
const MAX_RECONNECT_ATTEMPTS = 10;

const MessagesSocket = create<MessagesSocketType>((set, get) => ({
  reconnectAttempts: 0,
  reconnecting: false,
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

  reconnect: () => {
    const { reconnectAttempts, reconnecting, close, connect } = get();

    if (reconnecting) return;

    close();

    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      set({ reconnecting: true });

      const expInterval = Math.min(
        INITIAL_RECONNECT_INTERVAL * Math.pow(2, reconnectAttempts),
        MAX_RECONNECT_INTERVAL
      );

      setTimeout(() => {
        const attempt = reconnectAttempts + 1;
        console.log(
          `Reconnection attempt ${attempt}/${MAX_RECONNECT_ATTEMPTS}, waiting ${expInterval}ms`
        );

        set({ reconnectAttempts: reconnectAttempts + 1 });
        connect();
        set({ reconnecting: false });
      }, expInterval);
    } else {
      console.error('Max reconnect attempts reached.');
      set({ reconnecting: false });
    }
  },

  resetAttempts: () =>
    set(() => ({
      reconnectAttempts: 0,
      reconnecting: false,
    })),
}));

export default MessagesSocket;
