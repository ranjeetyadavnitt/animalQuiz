import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';

function ChatBox({ player }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    function onNewChatMessage(message) {
      setMessages(prev => [...prev, message]);
    }
    
    socket.on('new-chat-message', onNewChatMessage);
    
    return () => {
      socket.off('new-chat-message', onNewChatMessage);
    };
  }, []);
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    socket.emit('chat-message', inputMessage);
    setInputMessage('');
  };
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4 text-primary">Chat</h2>
      
      <div className="flex-grow overflow-y-auto mb-4 max-h-[60vh]">
        {messages.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg ${msg.sender === player.name ? 'bg-primary/10 ml-6' : 'bg-gray-100 mr-6'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{msg.sender}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p>{msg.message}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow text-white  px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          maxLength={100}
        />
        <button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatBox;