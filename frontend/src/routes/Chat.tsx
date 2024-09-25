import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
  type: 'response' | 'stream' | 'error' | 'streamComplete' | 'info';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    const dev = 'http://localhost:8080/ws/chat';
    const socket = new SockJS(dev);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        client.subscribe('/topic/messages', (message) => {
          console.log('Received message:', message.body);
          
          if (message.body.startsWith('generation:')) {
            const content = message.body.substring('generation:'.length);
            setMessages((prevMessages) => [...prevMessages, { type: 'response', content }]);
          } else {
            try {
              const payload = JSON.parse(message.body);
              if (payload && typeof payload === 'object' && 'type' in payload && 'content' in payload) {
                setMessages((prevMessages) => [...prevMessages, payload as ChatMessage]);
              } else {
                console.error('Invalid message format:', payload);
                setMessages((prevMessages) => [...prevMessages, { type: 'error', content: 'Received invalid message format' }]);
              }
            } catch (e) {
              console.error('Failed to parse message body:', e);
              setMessages((prevMessages) => [...prevMessages, { type: 'response', content: message.body }]);
            }
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });
    
    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (stompClient && input.trim() !== '') {
      stompClient.publish({ 
        destination: '/app/chat', 
        body: `generate:${input}`
      });
      console.log('Message sent:', input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-300 shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 mb-2 rounded-lg ${msg.type === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <p className={`text-sm ${msg.type === 'error' ? 'text-red-700' : 'text-gray-700'}`}>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message"
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;