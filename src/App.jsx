import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import PlayerEntry from './components/PlayerEntry';
import GameRoom from './components/GameRoom';


function App() {
  const [player, setPlayer] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    
    function onGameStarted(data) {
      setGameStarted(true);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game-started', onGameStarted);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game-started', onGameStarted);
    };
  }, []);

  const handlePlayerJoin = (playerName) => {
    setPlayer({
      name: playerName,
      id: socket.id
    });
    
    socket.emit('player-join', playerName);
  };

  return (
    <div className="min-h-screen bg-neutral-light flex flex-col">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">🦁 Animal Quiz Game</h1>
      </header>

      <main className="flex-grow container mx-auto p-4">
        {!player ? (
          <PlayerEntry onJoin={handlePlayerJoin} isConnected={isConnected} />
        ) : (
          <GameRoom player={player} />
        )}
      </main>

      <footer className="bg-neutral-dark text-white p-2 text-center text-sm">
        Animal Quiz Game © {new Date().getFullYear()} - Multiplayer Learning Fun
      </footer>
    </div>
  );
}

export default App;