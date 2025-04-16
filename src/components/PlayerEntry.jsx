import React, { useState } from 'react';

function PlayerEntry({ onJoin, isConnected }) {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!isConnected) {
      setError('Unable to connect to the game server. Please try again.');
      return;
    }
    
    onJoin(playerName.trim());
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Join the Quiz!</h2>
        <p className="text-gray-600">Test your animal knowledge against other players</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name to play"
            className="w-full px-4 py-2 text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={20}
          />
        </div>
        
        {error && (
          <div className="text-danger text-sm">{error}</div>
        )}
        
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-md transition-colors"
          disabled={!isConnected}
        >
          {isConnected ? 'Join Game' : 'Connecting...'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Connection Status: {isConnected ? 
            <span className="text-green-500">Connected</span> : 
            <span className="text-red-500">Disconnected</span>}
        </p>
      </div>
    </div>
  );
}

export default PlayerEntry;