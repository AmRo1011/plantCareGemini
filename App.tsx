
import React, { useState, useContext, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import PlantIdentifier from './components/PlantIdentifier';
import Chatbot from './components/Chatbot';
import { AppContext } from './contexts/AppContext';
import type { PlantIdentificationResult } from './types';
import { View } from './types';


export default function App() {
  const [view, setView] = useState<View>(View.IDENTIFY);
  const [plantContext, setPlantContext] = useState<PlantIdentificationResult | null>(null);
  const { language } = useContext(AppContext);
  const [chatKey, setChatKey] = useState(Date.now());

  const handleIdentificationComplete = useCallback((result: PlantIdentificationResult) => {
    setPlantContext(result);
    setView(View.CHAT);
  }, []);
  
  const handleStartNewIdentification = useCallback(() => {
    setPlantContext(null);
    setView(View.IDENTIFY);
    setChatKey(Date.now()); // Reset chat history by changing the key
  }, []);

  const handleNavigateToChat = useCallback(() => {
    setView(View.CHAT);
  }, []);


  return (
    <div className={`${language === 'ar' ? 'font-arabic' : 'font-sans'} min-h-screen flex flex-col bg-gray-50 text-gray-800`}>
      <Header 
        currentView={view} 
        onNavigateHome={handleStartNewIdentification} 
        onNavigateChat={handleNavigateToChat}
        isChatAvailable={!!plantContext}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {view === View.IDENTIFY ? (
          <PlantIdentifier onIdentificationComplete={handleIdentificationComplete} />
        ) : (
          <Chatbot key={chatKey} plantContext={plantContext} />
        )}
      </main>
      <Footer />
    </div>
  );
}
