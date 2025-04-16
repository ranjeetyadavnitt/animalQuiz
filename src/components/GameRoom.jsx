import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Leaderboard from './Leaderboard';
import QuestionCard from './QuestionCard';
import ChatBox from './ChatBox';
import GameResults from './GameResults';

function GameRoom({ player }) {
  const [isHost, setIsHost] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [waitingForNextRound, setWaitingForNextRound] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(10);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalResults, setFinalResults] = useState([]);
  
  useEffect(() => {
    function onSetAsHost() {
      setIsHost(true);
    }

    function onGameStatus(status) {
      setGameActive(status.isActive);
      setCurrentRound(status.currentRound);
      setTotalRounds(status.totalRounds);
      if (status.isActive && !status.canJoin) {
        setWaitingForNextRound(true);
      }
    }

    function onWaitForNextRound() {
      setWaitingForNextRound(true);
    }

    function onJoinCurrentGame() {
      setWaitingForNextRound(false);
    }

    function onGameStarted(data) {
      setGameActive(true);
      setCurrentRound(data.currentRound);
      setTotalRounds(data.totalRounds);
      setGameEnded(false);
      setFinalResults([]);
    }

    function onNewQuestion(question) {
      setCurrentQuestion(question);
      setAnswerResult(null);
    }

    function onRoundTimerStart(duration) {
      setTimeLeft(duration);
      const startTime = Date.now();
      const endTime = startTime + (duration * 1000);
      
      // Clear any existing interval
      if (window.timerInterval) {
        clearInterval(window.timerInterval);
      }
      
      // Create a new interval
      window.timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now) / 1000;
        
        setTimeLeft(Math.ceil(remaining));
        
        if (remaining <= 0) {
          clearInterval(window.timerInterval);
        }
      }, 100);
    }

    function onAnswerResult(result) {
      setAnswerResult(result);
      setCurrentQuestion(prev => ({
        ...prev,
        answered: true
      }));
    }

    function onGameEnded(data) {
      setGameActive(false);
      setGameEnded(true);
      setFinalResults(data.results);
      setCurrentQuestion(null);
    }

    function onGameReset() {
      setGameActive(false);
      setGameEnded(false);
      setCurrentRound(0);
      setCurrentQuestion(null);
      setAnswerResult(null);
      setWaitingForNextRound(false);
    }

    socket.on('set-as-host', onSetAsHost);
    socket.on('game-status', onGameStatus);
    socket.on('wait-for-next-round', onWaitForNextRound);
    socket.on('join-current-game', onJoinCurrentGame);
    socket.on('game-started', onGameStarted);
    socket.on('new-question', onNewQuestion);
    socket.on('round-timer-start', onRoundTimerStart);
    socket.on('answer-result', onAnswerResult);
    socket.on('game-ended', onGameEnded);
    socket.on('game-reset', onGameReset);

    return () => {
      socket.off('set-as-host', onSetAsHost);
      socket.off('game-status', onGameStatus);
      socket.off('wait-for-next-round', onWaitForNextRound);
      socket.off('join-current-game', onJoinCurrentGame);
      socket.off('game-started', onGameStarted);
      socket.off('new-question', onNewQuestion);
      socket.off('round-timer-start', onRoundTimerStart);
      socket.off('answer-result', onAnswerResult);
      socket.off('game-ended', onGameEnded);
      socket.off('game-reset', onGameReset);
      
      if (window.timerInterval) {
        clearInterval(window.timerInterval);
      }
    };
  }, []);

  const handleStartGame = () => {
    if (isHost) {
      socket.emit('start-game');
    }
  };

  const handleSubmitAnswer = (answer) => {
    if (!currentQuestion || currentQuestion.answered) return;
    
    socket.emit('submit-answer', {
      answer,
      timeLeft
    });
  };

  const handlePlayAgain = () => {
    if (isHost) {
      socket.emit('start-game');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Left column - Leaderboard */}
      <div className="md:col-span-1">
        <Leaderboard currentPlayerId={player.id} />
      </div>
      
      {/* Middle column - Game area */}
      <div className="md:col-span-1 flex flex-col space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="font-bold text-primary">Player: </span>
              <span>{player.name}</span>
              {isHost && <span className="ml-2 px-2 py-1 bg-accent text-white text-xs rounded-full">Host</span>}
            </div>
            <div>
              {currentRound > 0 && (
                <span className="font-bold">Round {currentRound}/{totalRounds}</span>
              )}
            </div>
          </div>
          
          {!gameActive && !gameEnded && isHost && (
            <button 
              onClick={handleStartGame}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-md transition-colors animate-pulse-slow"
            >
              Start Game
            </button>
          )}
          
          {!gameActive && !gameEnded && !isHost && (
            <div className="text-center p-4 bg-gray-100 rounded-md">
              <p>Waiting for host to start the game...</p>
            </div>
          )}
          
          {waitingForNextRound && (
            <div className="text-center p-4 bg-yellow-100 rounded-md">
              <p>Game in progress. You'll join at the next round!</p>
            </div>
          )}
          
          {currentQuestion && (
            <QuestionCard 
              question={currentQuestion}
              timeLeft={timeLeft}
              onSubmitAnswer={handleSubmitAnswer}
              answerResult={answerResult}
            />
          )}
          
          {gameEnded && (
            <GameResults 
              results={finalResults}
              currentPlayerId={player.id}
              onPlayAgain={handlePlayAgain}
              isHost={isHost}
            />
          )}
        </div>
      </div>
      
      {/* Right column - Chat */}
      <div className="md:col-span-1">
        <ChatBox player={player} />
      </div>
    </div>
  );
}

export default GameRoom;