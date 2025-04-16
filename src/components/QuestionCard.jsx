import React, { useState, useEffect } from 'react';

function QuestionCard({ question, timeLeft, onSubmitAnswer, answerResult }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  
  // Reset state when new question comes in
  useEffect(() => {
    setSelectedOption(null);
    setAnswered(false);
  }, [question?.question, question?.image]);
  
  const handleOptionSelect = (option) => {
    if (answered || answerResult) return;
    
    setSelectedOption(option);
    setAnswered(true);
    onSubmitAnswer(option);
  };
  
  // Import all images - in a real app you would handle this differently
  const getImagePath = (imageName) => {
    try {
      // This is a placeholder - you'd need to actually import the images
      return `/src/assets/images/animals/${imageName}`;
    } catch (error) {
      return '/src/assets/images/placeholder.png';
    }
  };
  
  const getOptionClass = (option) => {
    if (!answerResult) {
      return selectedOption === option
        ? 'bg-primary text-white'
        : 'bg-white hover:bg-gray-100';
    }
    
    if (option === answerResult.correctAnswer) {
      return 'bg-green-500 text-white';
    }
    
    if (selectedOption === option && option !== answerResult.correctAnswer) {
      return 'bg-red-500 text-white';
    }
    
    return 'bg-white opacity-70';
  };

  if (!question) return null;

  return (
    <div className="flex flex-col">
      {/* Timer */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${timeLeft > 5 ? 'bg-green-500' : 'bg-red-500'} transition-all duration-200 ease-linear`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
        <div className="text-right text-sm mt-1">
          {timeLeft} seconds left
        </div>
      </div>
      
      {/* Question */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-center mb-2">{question.question}</h3>
      </div>
      
      {/* Image */}
      <div className="mb-6 flex justify-center">
        <img 
          src={getImagePath(question.image)} 
          alt="Animal"
          className="w-64 h-64 object-cover rounded-lg shadow-md"
        />
      </div>
      
      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={answered || answerResult}
            className={`p-3 rounded-md border shadow-sm transition-colors ${getOptionClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {/* Answer result */}
      {answerResult && (
        <div className={`mt-4 p-3 rounded-md text-center ${answerResult.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {answerResult.correct ? (
            <div>
              <p className="font-bold">Correct! 🎉</p>
              <p>You earned {answerResult.points} points</p>
            </div>
          ) : (
            <div>
              <p className="font-bold">{answerResult.timedOut ? 'Time\'s up! ⏰' : 'Incorrect ❌'}</p>
              <p>The correct answer was: {answerResult.correctAnswer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;