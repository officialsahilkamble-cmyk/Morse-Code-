import React from 'react';
import { DotIcon } from './icons/DotIcon';
import { DashIcon } from './icons/DashIcon';

interface MorseButtonProps {
  type: 'dot' | 'dash';
  onClick: () => void;
  isAnimating?: boolean;
}

const MorseButton: React.FC<MorseButtonProps> = ({ type, onClick, isAnimating }) => {
  const isDot = type === 'dot';
  const label = isDot ? 'Dot' : 'Dash';
  const keyHint = isDot ? 'Z' : 'X';
  
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold py-4 px-4 rounded-lg flex flex-col items-center justify-center transition-transform transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${isAnimating ? 'scale-95' : ''}`}
    >
      {isDot ? <DotIcon /> : <DashIcon />}
      <span className="mt-2 text-xl">{label}</span>
      <span className="text-xs text-gray-500 dark:text-slate-400">( {keyHint} key )</span>
    </button>
  );
};

export default MorseButton;