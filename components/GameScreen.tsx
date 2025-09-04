import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MORSE_CODE_MAP } from '../constants';
import type { Level } from '../types';
import MorseButton from './MorseButton';
import ProgressBar from './ProgressBar';
import ResultFeedback from './ResultFeedback';
import Confetti from './Confetti';
import { getMorseHint } from '../services/geminiService';
import { LightbulbIcon } from './icons/LightbulbIcon';
import TimerBar from './TimerBar';
import TrainerMode from './TrainerMode';

interface GameScreenProps {
  level: Level;
  levelName: string;
  onBackToMenu: () => void;
  onLevelComplete: () => void;
  initialMode?: 'level' | 'practice';
}

const calculateTimeForChallenge = (challenge: string): number => {
    const morse = challenge.split('').map(char => MORSE_CODE_MAP[char]).join('');
    const baseTime = 5000; // 5 seconds
    const timePerSymbol = 400; // 0.4 seconds per dot/dash
    return baseTime + morse.length * timePerSymbol;
};

const GameScreen: React.FC<GameScreenProps> = ({ level, levelName, onBackToMenu, onLevelComplete, initialMode = 'level' }) => {
  const [mode, setMode] = useState<'level' | 'practice'>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'timeup' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hint, setHint] = useState<string>('');
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [activeInputButton, setActiveInputButton] = useState<'dot' | 'dash' | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  const currentChallenge = level.challenges[currentIndex] || '';
  const isWordChallenge = currentChallenge.length > 1;
  const correctAnswer = currentChallenge.split('').map(char => MORSE_CODE_MAP[char]).join('');

  const [totalTime, setTotalTime] = useState(() => calculateTimeForChallenge(currentChallenge));
  const [timeLeft, setTimeLeft] = useState(totalTime);


  const playSound = useCallback((soundType: 'dot' | 'dash' | 'correct' | 'incorrect') => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioCtxRef.current = new AudioContext();
        } else {
          console.error("Web Audio API is not supported in this browser.");
          return;
        }
      } catch (e) {
        console.error("Could not create AudioContext.", e);
        return;
      }
    }
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);

    switch (soundType) {
      case 'dot':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
        oscillator.start(now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.1);
        oscillator.stop(now + 0.1);
        break;
      case 'dash':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
        oscillator.start(now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.25);
        oscillator.stop(now + 0.25);
        break;
      case 'correct': {
        const startTime = audioCtx.currentTime;
        oscillator.type = 'triangle'; // A softer, more retro game-like sound
        oscillator.frequency.setValueAtTime(523.25, startTime); // C5
        oscillator.frequency.setValueAtTime(659.25, startTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, startTime + 0.2); // G5
        oscillator.frequency.setValueAtTime(1046.50, startTime + 0.3); // C6

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Quick fade-in to prevent clicks
        gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + 0.5); // Fade out over 0.5s

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
        break;
      }
      case 'incorrect':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(160, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        oscillator.start(now);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
        oscillator.stop(now + 0.2);
        break;
    }
  }, []);

  const resetForNext = useCallback(() => {
    setUserInput('');
    setFeedback(null);
    setShowConfetti(false);
    setHint('');
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < level.challenges.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetForNext();
    } else {
      onLevelComplete();
    }
  }, [currentIndex, level.challenges.length, onLevelComplete, resetForNext]);

  const handleTimeUp = useCallback(() => {
    if (feedback !== null) return;

    playSound('incorrect');
    setFeedback('timeup');
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    setTimeout(() => {
        handleNext();
    }, 1500);
  }, [feedback, handleNext, playSound]);

  // Timer reset effect
  useEffect(() => {
    if (mode !== 'level' || !currentChallenge) return;
    const newTotalTime = calculateTimeForChallenge(currentChallenge);
    setTotalTime(newTotalTime);
    setTimeLeft(newTotalTime);
  }, [currentChallenge, mode]);

  // Timer countdown effect
  useEffect(() => {
    if (mode !== 'level' || feedback === 'correct' || feedback === 'timeup') {
        return; // Stop the timer
    }

    if (timeLeft <= 0) {
        if (feedback === null) {
            handleTimeUp();
        }
        return;
    }

    const timerId = setInterval(() => {
        setTimeLeft(prevTime => {
            const newTime = prevTime - 100;
            if (newTime <= 0) {
                clearInterval(timerId);
                handleTimeUp();
                return 0;
            }
            return newTime;
        });
    }, 100);

    return () => clearInterval(timerId);
  }, [feedback, handleTimeUp, timeLeft, mode]);

  const handleInput = useCallback((char: '.' | '-') => {
    if (feedback === 'correct' || feedback === 'timeup') return;
    playSound(char === '.' ? 'dot' : 'dash');
    setUserInput(prev => prev + char);
    setFeedback(null);
    setActiveInputButton(char === '.' ? 'dot' : 'dash');
    setTimeout(() => setActiveInputButton(null), 150);
  }, [feedback, playSound]);
  
  const handleClear = useCallback(() => {
    if (feedback === 'correct' || feedback === 'timeup') return;
    setUserInput('');
    setFeedback(null);
  }, [feedback]);

  const handleSubmit = useCallback(() => {
    if (feedback === 'correct' || feedback === 'timeup') return;

    if (userInput === correctAnswer) {
      playSound('correct');
      setFeedback('correct');
      setShowConfetti(true);
    } else {
      playSound('incorrect');
      setFeedback('incorrect');
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [feedback, userInput, correctAnswer, playSound]);

  const handleGetHint = async () => {
      if (hint) {
          setHint('');
          return;
      }
      setIsHintLoading(true);
      const newHint = await getMorseHint(currentChallenge);
      setHint(newHint);
      setIsHintLoading(false);
  }
  
  const getChallengeFontSize = () => {
      if (currentChallenge.length > 6) return 'text-5xl';
      if (currentChallenge.length > 3) return 'text-6xl';
      return 'text-8xl';
  }

  useEffect(() => {
    if (mode !== 'level') return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key === 'z' || key === '.') {
        handleInput('.');
      } else if (key === 'x' || key === '-') {
        handleInput('-');
      } else if (key === 'enter') {
        if (feedback === 'correct') {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [feedback, handleInput, handleNext, handleSubmit, mode]);


  const progress = level.challenges.length > 0 ? ((currentIndex + 1) / level.challenges.length) * 100 : 0;
  
  const tabButtonClasses = (isActive: boolean) =>
    `px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
      isActive
        ? 'bg-white dark:bg-slate-800 text-yellow-500 dark:text-yellow-400'
        : 'bg-transparent text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="flex flex-col items-center justify-between h-full p-4 relative w-full">
      {showConfetti && <Confetti />}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <button onClick={onBackToMenu} className="text-teal-500 dark:text-teal-400 hover:text-teal-600 dark:hover:text-teal-300 transition">&larr; Back to Levels</button>
            <h2 className="text-xl font-bold text-yellow-500 dark:text-yellow-400">{mode === 'level' ? levelName : 'Practice Mode'}</h2>
        </div>
        <div className="border-b border-gray-300 dark:border-slate-700 mb-4">
          <div className="flex justify-center -mb-px">
            <button onClick={() => setMode('level')} className={tabButtonClasses(mode === 'level')} aria-pressed={mode === 'level'}>Level Challenge</button>
            <button onClick={() => setMode('practice')} className={tabButtonClasses(mode === 'practice')} aria-pressed={mode === 'practice'}>Practice Mode</button>
          </div>
        </div>
        {mode === 'level' && <ProgressBar progress={progress} />}
      </div>
      
      {mode === 'level' ? (
        <>
            <div className="flex flex-col items-center my-8 flex-grow justify-center">
                <p className="text-2xl text-gray-600 dark:text-slate-400 mb-2">Translate this {isWordChallenge ? 'word' : 'character'}:</p>
                <TimerBar currentTime={timeLeft} totalTime={totalTime} />
                <div className={`bg-gray-200 dark:bg-slate-800 rounded-lg p-8 shadow-lg transition-transform duration-500 flex items-center justify-center min-h-[160px] min-w-[120px] ${shaking ? 'animate-shake' : ''}`}>
                    <p className={`font-bold text-yellow-500 dark:text-yellow-400 break-all text-center ${getChallengeFontSize()}`}>
                        {currentChallenge}
                    </p>
                </div>
            </div>
            
            <div className="w-full max-w-sm">
                <div className="bg-gray-200 dark:bg-slate-800 rounded-lg h-20 mb-4 flex items-center justify-center p-4 overflow-x-auto">
                    <p className="text-4xl text-gray-900 dark:text-white tracking-widest font-mono shrink-0 h-10 flex items-center">
                    {userInput.length > 0 ? (
                        <>
                        <span>{userInput.slice(0, -1)}</span>
                        <span key={userInput.length} className="animate-pop-in">{userInput.slice(-1)}</span>
                        </>
                    ) : null}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <MorseButton type="dot" onClick={() => handleInput('.')} isAnimating={activeInputButton === 'dot'} />
                <MorseButton type="dash" onClick={() => handleInput('-')} isAnimating={activeInputButton === 'dash'} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={handleClear} disabled={feedback === 'correct' || feedback === 'timeup'} className="w-full bg-gray-400 hover:bg-gray-500 text-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold py-3 px-4 rounded-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">Clear</button>
                    {feedback !== 'correct' ? (
                        <button onClick={handleSubmit} disabled={feedback === 'timeup'} className={`w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${shaking && feedback === 'incorrect' ? 'animate-shake' : ''}`}>Submit</button>
                    ) : (
                        <button onClick={handleNext} className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 px-4 rounded-lg transition transform active:scale-95 animate-pulse">Next &rarr;</button>
                    )}
                </div>

                <div className="mt-4 min-h-[6rem] text-center">
                    <ResultFeedback status={feedback} />
                    <div className="mt-4">
                        <button onClick={handleGetHint} disabled={isHintLoading} className="flex items-center justify-center mx-auto gap-2 text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 disabled:opacity-50 transition">
                            <LightbulbIcon />
                            {isHintLoading ? 'Getting hint...' : (hint ? 'Hide Hint' : 'Get AI Hint')}
                        </button>
                        {hint && (
                            <p className="text-gray-600 dark:text-slate-400 mt-2 p-3 bg-gray-200 dark:bg-slate-800 rounded-md text-sm">{hint}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
      ) : (
        <TrainerMode playSound={playSound} />
      )}
    </div>
  );
};

export default GameScreen;