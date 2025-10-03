import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { View } from '../types';
import PlantIcon from './icons/PlantIcon';
import ChatIcon from './icons/ChatIcon';
import HistoryIcon from './icons/HistoryIcon';

interface HeaderProps {
    currentView: View;
    onNavigateHome: () => void;
    onNavigateChat: () => void;
    onNavigateHistory: () => void;
    isChatAvailable: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigateHome, onNavigateChat, onNavigateHistory, isChatAvailable }) => {
  const { language, switchLanguage, t } = useContext(AppContext);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <PlantIcon className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-green-primary">{t('appName')}</h1>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <nav className="hidden md:flex items-center space-x-2 rtl:space-x-reverse bg-gray-100 p-1 rounded-full">
                <button
                    onClick={onNavigateHome}
                    title={t('identify')}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${currentView === View.IDENTIFY ? 'bg-white text-green-primary shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <PlantIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onNavigateChat}
                    title={t('chat')}
                    disabled={!isChatAvailable}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${currentView === View.CHAT ? 'bg-white text-green-primary shadow' : 'text-gray-600 hover:bg-gray-200'} ${!isChatAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChatIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onNavigateHistory}
                    title="History"
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${currentView === View.HISTORY ? 'bg-white text-green-primary shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    <HistoryIcon className="w-5 h-5" />
                </button>
            </nav>
          <div className="relative">
             <select
                id="language-select"
                value={language}
                onChange={(e) => switchLanguage(e.target.value as 'en' | 'ar')}
                className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-full leading-tight focus:outline-none focus:bg-white focus:border-green-primary text-sm"
                aria-label={t('selectLanguage')}
                >
                <option value="en">English</option>
                <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;