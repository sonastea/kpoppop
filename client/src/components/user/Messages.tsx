import Conversation from 'components/messages/Conversation';
import Conversations from 'components/messages/Conversations';
import { useAuth } from 'contexts/AuthContext';
import { useWebSocket } from 'contexts/WebSocketContext';
import { useEffect } from 'react';

const Messages = () => {
  const { user } = useAuth();
  const ws = useWebSocket();

  if (!user) window.location.href = '/login';

  useEffect(() => {
    ws.on('connect', () => {
      ws.emit('socket-id', (response: string) => console.log('socket.id:', response));
    });
  }, [ws]);

  if (user) {
    return (
      <div className="w-full h-screen">
        <div className="flex h-full">
          <div className="flex-1 bg-gray-100 w-full h-full">
            <div className="m-auto w-11/12 h-full flex flex-col flex-wrap-reverse">
              <div className="flex-1 flex flex-col">
                <div className="hidden md:block heading">
                  <h1 className="text-3xl text-gray-700 mb-4">Messages</h1>
                </div>

                <div className="flex-1 flex h-full">
                  <Conversations />
                  <Conversation />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h2 className="flex items-center justify-center h-[30vh] text-lg md:text-2xl text-slate-500">
        Please login to view your messages.
      </h2>
    );
  }
};

export default Messages;
