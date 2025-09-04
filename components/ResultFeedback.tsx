import React from 'react';

interface ResultFeedbackProps {
  status: 'correct' | 'incorrect' | 'timeup' | null;
}

const ResultFeedback: React.FC<ResultFeedbackProps> = ({ status }) => {
  if (status === null) {
    return null;
  }

  let text = '';
  let colorClass = '';

  switch (status) {
    case 'correct':
      text = 'Correct!';
      colorClass = 'text-green-400';
      break;
    case 'incorrect':
      text = 'Try Again!';
      colorClass = 'text-red-400';
      break;
    case 'timeup':
      text = "Time's Up!";
      colorClass = 'text-red-400';
      break;
  }

  return (
    <p className={`text-2xl font-bold ${colorClass} animate-fade-in`}>
      {text}
    </p>
  );
};

export default ResultFeedback;