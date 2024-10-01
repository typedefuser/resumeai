import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
const chartURL=import.meta.env.VITE_CHAT_URL
interface ChatMessage {
  type: 'user' | 'response' | 'stream' | 'error' | 'streamComplete' | 'info';
  content: string;
}

interface ChatProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

export default function Chat({ messages, onMessagesChange }: ChatProps) {
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const dev = chartURL||'http://localhost:8080/ws/chat';
    const token = localStorage.getItem('token');

    const socket = new SockJS(dev,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe('/topic/messages', (message) => {
          console.log('Received message:', message.body);

          if (message.body.startsWith('generation:')) {
            const content = message.body.substring('generation:'.length);
            onMessagesChange([...messages, { type: 'response', content }]);
          } else {
            try {
              const payload = JSON.parse(message.body);
              if (payload && typeof payload === 'object' && 'type' in payload && 'content' in payload) {
                onMessagesChange([...messages, payload as ChatMessage]);
              } else {
                console.error('Invalid message format:', payload);
                onMessagesChange([...messages, { type: 'error', content: 'Received invalid message format' }]);
              }
            } catch (e) {
              console.error('Failed to parse message body:', e);
              onMessagesChange([...messages, { type: 'response', content: message.body }]);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        setIsConnected(false);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [messages, onMessagesChange]);

  const handleSendMessage = () => {
    if (stompClient && stompClient.active && input.trim() !== '') {
      onMessagesChange([...messages, { type: 'user', content: input }]);

      stompClient.publish({
        destination: '/app/chat',
        body: `generate:${input}`
      });
      console.log('Message sent:', input);
      setInput('');
    } else {
      console.warn('Cannot send message, STOMP client is not connected.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-300 shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 mb-2 rounded-lg ${
            msg.type === 'user' ? 'bg-blue-100 ml-auto' :
            msg.type === 'error' ? 'bg-red-100' : 'bg-gray-100'
          } max-w-[80%]`}>
            <p className={`text-sm ${
              msg.type === 'user' ? 'text-blue-700' :
              msg.type === 'error' ? 'text-red-700' : 'text-gray-700'
            }`}>{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          >
            Send
          </button>
        </div>
        {!isConnected && <p className="text-red-500 text-sm mt-2">Connecting...</p>} {/* Status message */}
      </div>
    </div>
  );
}
