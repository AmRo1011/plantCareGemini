
import React, { useState, useContext, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PlantIdentifier from './components/PlantIdentifier';
import Chatbot from './components/Chatbot';
import HistoryView from './components/HistoryView';
import { AppContext } from './contexts/AppContext';
import { useHistory } from './hooks/useHistory';
import type { PlantIdentificationResult, HistoryItem, ChatMessage } from './types';
import { View } from './types';


export default function App() {
  const [view, setView] = useState<View>(View.IDENTIFY);
  const [currentSession, setCurrentSession] = useState<HistoryItem | null>(null);
  const { language } = useContext(AppContext);
  const { history, addHistoryItem } = useHistory();

  const saveCurrentSession = useCallback(() => {
    if (currentSession) {
      addHistoryItem(currentSession);
    }
  }, [currentSession, addHistoryItem]);

  const handleIdentificationComplete = useCallback((result: PlantIdentificationResult, image: string) => {
    saveCurrentSession(); // Save previous session if any
    const newSession: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      plant: result,
      image: image,
      chat: [],
    };
    setCurrentSession(newSession);
    setView(View.CHAT);
  }, [saveCurrentSession]);
  
  const handleStartNewIdentification = useCallback(() => {
    saveCurrentSession();
    setCurrentSession(null);
    setView(View.IDENTIFY);
  }, [saveCurrentSession]);

  const handleNavigateToChat = useCallback(() => {
    if (currentSession) {
      setView(View.CHAT);
    }
  }, [currentSession]);

  const handleNavigateToHistory = useCallback(() => {
    saveCurrentSession();
    setCurrentSession(null);
    setView(View.HISTORY);
  }, [saveCurrentSession]);
  
  const handleChatUpdate = useCallback((messages: ChatMessage[]) => {
    setCurrentSession(prev => {
        if (!prev) return null;
        return { ...prev, chat: messages };
    });
  }, []);

  const renderView = () => {
    switch(view) {
        case View.IDENTIFY:
            return <PlantIdentifier onIdentificationComplete={handleIdentificationComplete} />;
        case View.CHAT:
            if (currentSession) {
                return <Chatbot 
                    key={currentSession.id} 
                    plantContext={currentSession.plant} 
                    initialMessages={currentSession.chat}
                    onChatUpdate={handleChatUpdate}
                />;
            }
            // Fallback if there's no session
            handleStartNewIdentification();
            return null; 
        case View.HISTORY:
            return <HistoryView history={history} />;
        default:
             return <PlantIdentifier onIdentificationComplete={handleIdentificationComplete} />;
    }
  }


  return (
    <div className={`${language === 'ar' ? 'font-arabic' : 'font-sans'} min-h-screen flex flex-col bg-gray-50 text-gray-800`}>
      <Header 
        currentView={view} 
        onNavigateHome={handleStartNewIdentification} 
        onNavigateChat={handleNavigateToChat}
        onNavigateHistory={handleNavigateToHistory}
        isChatAvailable={!!currentSession}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}
