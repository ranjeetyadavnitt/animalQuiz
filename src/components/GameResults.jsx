import React from 'react';

function GameResults({ results, currentPlayerId, onPlayAgain, isHost }) {
  const playerRank = results.findIndex(player => player.id === currentPlayerId) + 1;
  const winner = results.length > 0 ? results[0] : null;
  
  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-4">Game Over!</h2>

      {winner && (
        <div className="mb-6">
          <div className="text-xl">🏆 Winner: <span className="font-bold text-primary">{winner.name}</span> 🏆</div>
          <div className="text-lg">Score: {winner.score} points</div>
        </div>
      )}
      
      {currentPlayerId && (
        <div className="mb-6">
          <div className="text-lg">Your Rank: {playerRank}/{results.length}</div>
          <div className="text-md">
            {playerRank === 1 ? "Congratulations! You won!" : 
             playerRank === 2 ? "Great job! Almost at the top!" : 
             playerRank === 3 ? "Nice work! You made the podium!" : 
             "Better luck next time!"}
          </div>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h3 className="font-bold mb-2">Final Standings</h3>
        <div className="space-y-2">
          {results.slice(0, 5).map((player, index) => (
            <div 
              key={player.id} 
              className={`flex justify-between p-2 rounded ${player.id === currentPlayerId ? 'bg-blue-100' : index === 0 ? 'bg-yellow-100' : ''}`}
            >
              <div>
                {index === 0 && '🥇 '}
                {index === 1 && '🥈 '}
                {index === 2 && '🥉 '}
                {index + 1}. {player.name}
              </div>
              <div className="font-mono font-bold">{player.score}</div>
            </div>
          ))}
        </div>
      </div>
      
      {isHost && (
        <button 
          onClick={onPlayAgain}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-md transition-colors"
        >
          Play Again
        </button>
      )}
      
      {!isHost && (
        <div className="text-gray-600 italic">
          Waiting for host to start a new game...
        </div>
      )}
    </div>
  );
}

export default GameResults;