import React, { useEffect, useRef } from 'react';
import type { Level } from '../types';
import { LockIcon } from './icons/LockIcon';

interface LevelSelectScreenProps {
  levels: Level[];
  onSelectLevel: (level: Level, index: number) => void;
  onSelectPractice: () => void;
  highestUnlockedLevel: number;
  lastCompletedLevel: number | null;
}

const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({ levels, onSelectLevel, onSelectPractice, highestUnlockedLevel, lastCompletedLevel }) => {
  const levelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    levelRefs.current = levelRefs.current.slice(0, levels.length);
  }, [levels]);

  useEffect(() => {
    if (lastCompletedLevel !== null) {
      const nextLevelIndex = lastCompletedLevel + 1;
      const nextLevelElement = levelRefs.current[nextLevelIndex];
      if (nextLevelElement) {
        nextLevelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [lastCompletedLevel, levels.length]);

  return (
    <div className="flex flex-col items-center flex-grow h-full">
      <h1 className="text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-2">Select a Level</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">You have unlocked {highestUnlockedLevel + 1} of {levels.length} levels. Keep going!</p>
      <div ref={scrollContainerRef} className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-grow h-0 p-1 pr-3">
        {/* Practice Mode Card */}
        <button
          onClick={onSelectPractice}
          className="md:col-span-2 lg:col-span-3 p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out text-left h-36 flex flex-col justify-between bg-purple-800 hover:bg-purple-700 hover:scale-105"
        >
          <div>
            <span className="text-sm font-semibold text-yellow-300">TRAINING</span>
            <h3 className="text-xl font-bold mt-1 text-white">Practice Mode</h3>
          </div>
          <p className="text-sm text-purple-200">Hone your skills with focused drills. No timers, no pressure.</p>
        </button>

        {levels.map((level, index) => {
          const isLocked = index > highestUnlockedLevel;
          return (
            <button
              key={index}
              ref={el => { levelRefs.current[index] = el; }}
              onClick={() => onSelectLevel(level, index)}
              disabled={isLocked}
              className={`p-6 rounded-lg shadow-md transition-all duration-200 ease-in-out text-left h-36 flex flex-col justify-between
                ${isLocked 
                  ? 'bg-gray-100 ring-1 ring-gray-300 dark:bg-slate-900 dark:ring-slate-700 cursor-not-allowed' 
                  : 'bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 hover:scale-105'
                }`}
            >
              <div className="flex justify-between items-start">
                  <span className={`text-sm font-semibold ${isLocked ? 'text-gray-400 dark:text-slate-600' : 'text-teal-500 dark:text-teal-400'}`}>Level {index + 1}</span>
                  {isLocked && <LockIcon />}
              </div>
              <h3 className={`text-lg font-bold mt-1 ${isLocked ? 'text-gray-400 dark:text-slate-700' : 'text-gray-800 dark:text-slate-200'}`}>{level.name}</h3>
              <p className={`text-xs mt-2 ${isLocked ? 'text-gray-400 dark:text-slate-700' : 'text-gray-500 dark:text-slate-400'}`}>{level.challenges.join(', ')}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelectScreen;