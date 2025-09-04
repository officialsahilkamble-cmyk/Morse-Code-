import React from 'react';

interface TimerBarProps {
  currentTime: number;
  totalTime: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ currentTime, totalTime }) => {
  const percentage = Math.max(0, (currentTime / totalTime) * 100);

  const getColor = () => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-400';
    return 'bg-teal-500';
  };

  return (
    <div className="w-full max-w-sm bg-gray-300 dark:bg-slate-700 rounded-full h-3 my-2 shadow-inner">
      <div
        className={`h-3 rounded-full transition-all duration-100 ease-linear ${getColor()}`}
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
        aria-label="Time remaining"
      ></div>
    </div>
  );
};

export default TimerBar;