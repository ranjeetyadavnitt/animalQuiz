import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

function Leaderboard({ currentPlayerId }) {
  const [players, setPlayers] = useState([]);
  const [joined, setJoined] = useState({});
  const [left, setLeft] = useState({});
  
  useEffect(() => {
    function onLeaderboardUpdate(leaderboard) {
      // Track new players for animation
      const newPlayers = {};
      leaderboard.forEach(player => {
        if (!players.some(p => p.id === player.id)) {
          newPlayers[player.id] = true;
        }
      });
      
      setPlayers(leaderboard);
      setJoined(newPlayers);
      
      // Reset joined animation after 2 seconds
      if (Object.keys(newPlayers).length) {
        setTimeout(() => {
          setJoined({});
        }, 2000);
      }
    }
    
    function onPlayerLeft(playerId) {
      setLeft(prev => ({ ...prev, [playerId]: true }));
      
      // Remove player from left animation after animation completes
      setTimeout(() => {
        setLeft(prev => {
          const updated = { ...prev };
          delete updated[playerId];
          return updated;
        });
      }, 500);
    }
    
    socket.on('leaderboard-update', onLeaderboardUpdate);
    socket.on('player-left', onPlayerLeft);
    
    return () => {
      socket.off('leaderboard-update', onLeaderboardUpdate);
      socket.off('player-left', onPlayerLeft);
    };
  }, [players]);

  const getRowClass = (playerId) => {
    let classes = 'transition-all duration-300 border-b py-2';
    
    if (joined[playerId]) {
      classes += ' animate-pulse bg-green-100';
    }
    
    if (playerId === currentPlayerId) {
      classes += ' font-bold bg-blue-50';
    }
    
    if (left[playerId]) {
      classes += ' opacity-0 scale-95';
    }
    
    return classes;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-full">
      <h2 className="text-xl font-bold mb-4 text-primary">Leaderboard</h2>
      
      {players.length === 0 ? (
        <div className="text-center p-4 text-gray-500">
          No players have joined yet
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="pb-2 text-left">Rank</th>
                <th className="pb-2 text-left">Player</th>
                <th className="pb-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={player.id} className={getRowClass(player.id)}>
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{player.name}</td>
                  <td className="py-2 text-right font-mono">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;