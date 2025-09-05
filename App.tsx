import React, { useState, useCallback, useEffect } from 'react';
// ADMOB: Import AdMob library
import { AdMob, AdOptions, AdSize, AdPosition, AppOpenAdOptions } from '@capacitor-community/admob';
import LevelSelectScreen from './components/LevelSelectScreen';
import GameScreen from './components/GameScreen';
import Header from './components/Header';
import Modal from './components/Modal';
import AboutUsContent from './components/AboutUsContent';
import PrivacyPolicyContent from './components/PrivacyPolicyContent';
import TermsAndConditionsContent from './components/TermsAndConditionsContent';
import SplashScreen from './components/SplashScreen';
import { ALL_LEVELS } from './constants';
import type { Level } from './types';
import { OfflineWarning } from './components/OfflineWarning';

type Screen = 'levelSelect' | 'game';
type ModalType = 'about' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<Screen>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [levelIndex, setLevelIndex] = useState<number>(0);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [initialGameMode, setInitialGameMode] = useState<'level' | 'practice'>('level');

  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    const savedProgress = localStorage.getItem('morseMasterProgress');
    return savedProgress ? parseInt(savedProgress, 10) : 0;
  });

  const [lastCompletedLevel, setLastCompletedLevel] = useState<number | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('morseMasterTheme') as 'light' | 'dark' | null;
    return savedTheme || 'dark';
  });

  // ADMOB: New useEffect hook specifically for initializing ads.
  // This runs only ONCE when the app first loads.
  useEffect(() => {
    const initializeAndShowAds = async () => {
      // 1. Initialize AdMob
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: [], // Add your test device ID here for development
        initializeForTesting: true,
      });

      // 2. Prepare and show the App Open Ad
      const appOpenOptions: AppOpenAdOptions = {
        adId: 'ca-app-pub-4897524780440810/4010744536',
        isTesting: false, // ⚠️ IMPORTANT: Set to 'false' for publishing!
      };
      // We wrap this in a try/catch block to prevent app crashes if the ad fails to show.
      try {
        await AdMob.prepareAppOpen(appOpenOptions);
        await AdMob.showAppOpen();
      } catch (e) {
        console.error("App Open Ad failed", e);
      }
      
      // 3. Show the Banner Ad
      const bannerOptions: AdOptions = {
        adId: 'ca-app-pub-4897524780440810/2697662864',
        adSize: AdSize.BANNER,
        position: AdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: false, // ⚠️ IMPORTANT: Set to 'false' for publishing!
      };
      // We wrap this in a try/catch block as well.
      try {
        await AdMob.showBanner(bannerOptions);
      } catch(e) {
        console.error("Banner Ad failed", e);
      }
    };

    // Run the ad initialization function
    initializeAndShowAds();
  }, []); // The empty array [] ensures this runs only once.


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('morseMasterTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStart = () => {
    setShowSplash(false);
  };

  const handleLevelSelect = useCallback((level: Level, index: number) => {
    if (index <= highestUnlockedLevel) {
      setSelectedLevel(level);
      setLevelIndex(index);
      setInitialGameMode('level');
      setScreen('game');
    }
  }, [highestUnlockedLevel]);

  const handlePracticeSelect = useCallback(() => {
    const practiceLevel: Level = { name: 'Practice', challenges: [] };
    setSelectedLevel(practiceLevel);
    setLevelIndex(-1);
    setInitialGameMode('practice');
    setScreen('game');
  }, []);

  const handleBackToMenu = useCallback(() => {
    setScreen('levelSelect');
    setSelectedLevel(null);
  }, []);

  const handleLevelComplete = useCallback(() => {
    const completedLevelIndex = levelIndex;
    const nextLevel = completedLevelIndex + 1;
    if (nextLevel > highestUnlockedLevel) {
        setHighestUnlockedLevel(nextLevel);
        localStorage.setItem('morseMasterProgress', nextLevel.toString());
    }
    setLastCompletedLevel(completedLevelIndex);
    handleBackToMenu();
  }, [levelIndex, highestUnlockedLevel, handleBackToMenu]);

  const getModalTitle = (modal: ModalType | null) => {
    switch(modal) {
        case 'about': return 'About & Contact';
        case 'privacy': return 'Privacy Policy';
        case 'terms': return 'Terms & Conditions';
        default: return '';
    }
  };

  const openModal = (modalType: ModalType) => setActiveModal(modalType);

  return (
    <>
      {showSplash ? (
        <SplashScreen 
          onStart={handleStart} 
          onShowAbout={() => openModal('about')}
          onShowPrivacy={() => openModal('privacy')}
          onShowTerms={() => openModal('terms')}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-200 flex flex-col items-center p-4 transition-colors duration-300">
          <Header theme={theme} toggleTheme={toggleTheme} />
          <main className="w-full max-w-4xl mx-auto mt-8 flex-grow flex flex-col">
            {screen === 'levelSelect' && (
              !isOnline ? (
                <OfflineWarning />
              ) : (
                <LevelSelectScreen 
                  levels={ALL_LEVELS} 
                  onSelectLevel={handleLevelSelect}
                  onSelectPractice={handlePracticeSelect}
                  highestUnlockedLevel={highestUnlockedLevel}
                  lastCompletedLevel={lastCompletedLevel}
                />
              )
            )}
            {screen === 'game' && selectedLevel && (
              <GameScreen
                level={selectedLevel}
                levelName={`Level ${levelIndex + 1}`}
                onBackToMenu={handleBackToMenu}
                onLevelComplete={handleLevelComplete}
                initialMode={initialGameMode}
              />
            )}
          </main>
          <footer className="text-center py-4 text-gray-500 dark:text-slate-500 text-sm w-full max-w-4xl mx-auto">
            <p>Learn Morse Code the fun way with AI assistance.</p>
            <div className="flex justify-center items-center gap-4 mt-2">
                <button onClick={() => setActiveModal('about')} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">About & Contact</button>
                <span className="text-gray-400 dark:text-slate-600">|</span>
                <button onClick={() => setActiveModal('privacy')} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">Privacy Policy</button>
                <span className="text-gray-400 dark:text-slate-600">|</span>
                <button onClick={() => setActiveModal('terms')} className="hover:text-gray-900 dark:hover:text-slate-300 transition-colors duration-200">Terms & Conditions</button>
            </div>
          </footer>
        </div>
      )}

      {activeModal && (
        <Modal title={getModalTitle(activeModal)} onClose={() => setActiveModal(null)}>
            {activeModal === 'about' && <AboutUsContent />}
            {activeModal === 'privacy' && <PrivacyPolicyContent />}
            {activeModal === 'terms' && <TermsAndConditionsContent />}
        </Modal>
      )}
    </>
  );
};

export default App;