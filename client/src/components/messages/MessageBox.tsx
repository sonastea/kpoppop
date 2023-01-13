import { useWebSocket } from 'contexts/WebSocketContext';
import { KeyboardEvent, useRef } from 'react';

const MessageBox = () => {
  const chatInput = useRef<HTMLTextAreaElement | null>(null);
  const socket = useWebSocket();

  const handleSendMessage = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      socket.emit('test', 'lorem');
    }

    if (e.code === 'Enter' && !e.shiftKey) e.preventDefault();
  };

  return (
    <div className="pt-4 px-2 pb-10">
      <div className="write bg-white shadow flex rounded-lg border">
        <div className="flex-1">
          <textarea
            className="w-full block outline-none py-4 px-4 bg-transparent"
            ref={chatInput}
            placeholder="Start a new message"
            style={{ resize: 'none' }}
            rows={1}
            onKeyDown={(e) => handleSendMessage(e)}
          />
        </div>
        <div className="p-2 flex content-center items-center">
          <div className="flex-1">
            <button className="hover:bg-once-200/75 hover:rounded-full w-10 h-10 rounded-full inline-block">
              <span className="inline-block align-text-bottom">
                <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 24 24">
                  <path
                    fill="#ff5fa2"
                    d="M3 20V4L22 12M5 17L16.85 12L5 7V10.5L11 12L5 13.5M5 17V7 13.5Z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
