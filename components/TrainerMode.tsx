import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MORSE_CODE_MAP } from '../constants';
import MorseButton from './MorseButton';

interface TrainerModeProps {
  playSound: (soundType: 'dot' | 'dash' | 'correct' | 'incorrect') => void;
}

type Direction = 'morseToText' | 'textToMorse';
type CharSet = 'letters' | 'numbers' | 'all';

const CHAR_SETS: Record<CharSet, string[]> = {
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    numbers: '0123456789'.split(''),
    all: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
};

const TrainerMode: React.FC<TrainerModeProps> = ({ playSound }) => {
    const [direction, setDirection] = useState<Direction>('textToMorse');
    const [charSet, setCharSet] = useState<CharSet>('letters');
    const [isPracticing, setIsPracticing] = useState(false);
    const [currentChallenge, setCurrentChallenge] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect', message: string } | null>(null);
    const [userInput, setUserInput] = useState('');
    const [activeInputButton, setActiveInputButton] = useState<'dot' | 'dash' | null>(null);
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

    const textInputRef = useRef<HTMLInputElement>(null);
    const isPlayingSoundRef = useRef(false);

    const generateNewChallenge = useCallback(() => {
        const availableChars = CHAR_SETS[charSet];
        const newChallenge = availableChars[Math.floor(Math.random() * availableChars.length)];
        setCurrentChallenge(newChallenge);
        setUserInput('');
        setFeedback(null);
        setIsAnswerRevealed(false);
    }, [charSet]);

    const playChallengeSound = useCallback(async (char: string) => {
        if (isPlayingSoundRef.current) return;
        isPlayingSoundRef.current = true;
        const morse = MORSE_CODE_MAP[char];
        if (!morse) return;
    
        await new Promise(resolve => setTimeout(resolve, 500)); // Initial delay

        for (const symbol of morse) {
            if (symbol === '.') {
                playSound('dot');
                await new Promise(resolve => setTimeout(resolve, 200));
            } else if (symbol === '-') {
                playSound('dash');
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }
        await new Promise(resolve => setTimeout(resolve, 300)); // Post-play delay
        isPlayingSoundRef.current = false;
        textInputRef.current?.focus();
    }, [playSound]);

    useEffect(() => {
        if (isPracticing && direction === 'morseToText' && currentChallenge) {
            playChallengeSound(currentChallenge);
        }
    }, [isPracticing, direction, currentChallenge, playChallengeSound]);
    
    useEffect(() => {
        if (isPracticing && direction === 'morseToText') {
            textInputRef.current?.focus();
        }
    }, [isPracticing, direction, feedback]);

    const handleStart = () => {
        setIsPracticing(true);
        generateNewChallenge();
    };

    const handleStop = () => {
        setIsPracticing(false);
        setCurrentChallenge('');
        setFeedback(null);
        setUserInput('');
    };

    const handleMorseInput = (char: '.' | '-') => {
        playSound(char === '.' ? 'dot' : 'dash');
        setUserInput(prev => prev + char);
        setActiveInputButton(char === '.' ? 'dot' : 'dash');
        setTimeout(() => setActiveInputButton(null), 150);
    };

    const handleSubmit = () => {
        if (!userInput.trim()) return;

        let isCorrect = false;
        let correctAnswer = '';

        if (direction === 'textToMorse') {
            correctAnswer = MORSE_CODE_MAP[currentChallenge];
            isCorrect = userInput === correctAnswer;
        } else { // morseToText
            correctAnswer = currentChallenge;
            isCorrect = userInput.toUpperCase() === correctAnswer;
        }

        if (isCorrect) {
            playSound('correct');
            setFeedback({ type: 'correct', message: 'Correct!' });
        } else {
            playSound('incorrect');
            setFeedback({ type: 'incorrect', message: `Correct answer: ${correctAnswer}` });
        }

        setTimeout(() => {
            generateNewChallenge();
        }, 1500);
    };

    const renderPracticeArea = () => {
        if (!isPracticing) {
            return (
                <div className="text-center p-8 bg-gray-200 dark:bg-slate-800 rounded-lg shadow-lg">
                    <p className="text-xl text-gray-700 dark:text-slate-300">Ready to practice?</p>
                </div>
            );
        }

        if (direction === 'textToMorse') {
            return (
                <>
                    <p className="text-2xl text-gray-600 dark:text-slate-400 mb-2">Translate this character:</p>
                    <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-8 shadow-lg flex items-center justify-center min-h-[160px] min-w-[120px]">
                        <p className="font-bold text-yellow-500 dark:text-yellow-400 text-8xl">{currentChallenge}</p>
                    </div>
                </>
            );
        } else { // morseToText
            return (
                <>
                    <p className="text-2xl text-gray-600 dark:text-slate-400 mb-2">Listen and translate:</p>
                    <div className="bg-gray-200 dark:bg-slate-800 rounded-lg p-8 shadow-lg flex flex-col items-center justify-center min-h-[160px] min-w-[200px] text-center">
                        <p className="font-mono text-4xl sm:text-5xl text-teal-400 tracking-widest mb-4" aria-label={`Morse code: ${MORSE_CODE_MAP[currentChallenge]}`}>{MORSE_CODE_MAP[currentChallenge]}</p>
                        <button onClick={() => playChallengeSound(currentChallenge)} disabled={isPlayingSoundRef.current} aria-label="Replay Morse code sound">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 transition-colors ${isPlayingSoundRef.current ? 'text-slate-600' : 'text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </button>
                    </div>
                </>
            );
        }
    };
    
    const renderControls = () => {
        if (!isPracticing) return null;

        if (direction === 'textToMorse') {
             return (
                <>
                    <div className="bg-gray-200 dark:bg-slate-800 rounded-lg h-20 mb-4 flex items-center justify-center p-4 overflow-x-auto">
                        <p className="text-4xl text-gray-900 dark:text-white tracking-widest font-mono shrink-0 h-10 flex items-center">{userInput}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <MorseButton type="dot" onClick={() => handleMorseInput('.')} isAnimating={activeInputButton === 'dot'} />
                        <MorseButton type="dash" onClick={() => handleMorseInput('-')} isAnimating={activeInputButton === 'dash'} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setUserInput('')} className="w-full bg-gray-400 hover:bg-gray-500 text-gray-900 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white font-bold py-3 px-4 rounded-lg transition transform active:scale-95">Clear</button>
                        <button onClick={handleSubmit} className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition transform active:scale-95">Submit</button>
                    </div>
                </>
             )
        } else { // morseToText
            return (
                <>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <input
                            ref={textInputRef}
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            maxLength={1}
                            className="bg-gray-200 text-gray-900 dark:bg-slate-800 dark:text-white text-4xl text-center w-full rounded-lg h-20 mb-4 p-4 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            aria-label="Enter translated character"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <button type="submit" className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition transform active:scale-95">Submit</button>
                    </form>
                    <div className="mt-4 text-center min-h-[2.5rem]">
                        {!isAnswerRevealed && !feedback && (
                            <button onClick={() => setIsAnswerRevealed(true)} className="text-purple-500 dark:text-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition text-sm">
                                Reveal Answer
                            </button>
                        )}
                        {isAnswerRevealed && !feedback && (
                            <p className="text-yellow-500 dark:text-yellow-400 animate-fade-in">Answer: {currentChallenge}</p>
                        )}
                    </div>
                </>
            )
        }
    }
    
    const renderFeedback = () => {
        if (!feedback) return <div className="min-h-[3rem]"></div>;
        return (
            <div className={`min-h-[3rem] text-center text-2xl font-bold p-2 ${feedback.type === 'correct' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {feedback.message}
            </div>
        )
    };
    
    const settingsOptionClasses = (isActive: boolean) =>
    `px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-purple-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
    }`;


    return (
        <div className="flex flex-col items-center justify-start h-full w-full">
            {/* Settings */}
            <div className="w-full max-w-sm mb-6 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg">
                <fieldset className="mb-4" disabled={isPracticing}>
                    <legend className="text-gray-600 dark:text-slate-400 text-lg font-semibold mb-2">Practice Direction</legend>
                    <div className="flex justify-center gap-2">
                        <button onClick={() => setDirection('textToMorse')} className={settingsOptionClasses(direction === 'textToMorse')} aria-pressed={direction === 'textToMorse'}>Text to Morse</button>
                        <button onClick={() => setDirection('morseToText')} className={settingsOptionClasses(direction === 'morseToText')} aria-pressed={direction === 'morseToText'}>Morse to Text</button>
                    </div>
                </fieldset>
                <fieldset disabled={isPracticing}>
                    <legend className="text-gray-600 dark:text-slate-400 text-lg font-semibold mb-2">Character Set</legend>
                    <div className="flex justify-center gap-2">
                        <button onClick={() => setCharSet('letters')} className={settingsOptionClasses(charSet === 'letters')} aria-pressed={charSet === 'letters'}>Letters</button>
                        <button onClick={() => setCharSet('numbers')} className={settingsOptionClasses(charSet === 'numbers')} aria-pressed={charSet === 'numbers'}>Numbers</button>
                        <button onClick={() => setCharSet('all')} className={settingsOptionClasses(charSet === 'all')} aria-pressed={charSet === 'all'}>All</button>
                    </div>
                </fieldset>
            </div>
            
            {/* Start/Stop Button */}
            <div className="w-full max-w-sm mb-4">
            {!isPracticing ? (
                <button onClick={handleStart} className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-3 px-4 rounded-lg text-xl transition transform hover:scale-105">Start Practice</button>
            ) : (
                <button onClick={handleStop} className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-4 rounded-lg text-xl transition transform hover:scale-105">Stop Practice</button>
            )}
            </div>

            {/* Main Interaction Area */}
            <div className="flex flex-col items-center flex-grow justify-start">
                {renderPracticeArea()}
            </div>
            
            <div className="w-full max-w-sm mt-4">
                {renderControls()}
                <div className="mt-4 text-center">
                    {renderFeedback()}
                </div>
            </div>
        </div>
    );
};

export default TrainerMode;