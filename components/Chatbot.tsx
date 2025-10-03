
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import { startChatSession, sendMessage } from '../services/geminiService';
import type { ChatMessage, PlantIdentificationResult } from '../types';
import ChatIcon from './icons/ChatIcon';

interface ChatbotProps {
  plantContext: PlantIdentificationResult | null;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5 rtl:space-x-reverse self-start p-3 rounded-lg bg-gray-200">
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
);


const Chatbot: React.FC<ChatbotProps> = ({ plantContext }) => {
  const { t, language } = useContext(AppContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const systemInstruction = language === 'ar' 
        ? "أنت مساعد خبير في العناية بالنباتات. كن ودودًا وقدم نصائح عملية ومفيدة."
        : "You are an expert plant care assistant. Be friendly and provide practical, helpful advice.";
    
    startChatSession(systemInstruction);

    const initialMessage = plantContext 
      ? t('chatWithContext', { plantName: plantContext.commonName }) 
      : t('chatInitial');

    setMessages([{ role: 'assistant', content: initialMessage }]);
  }, [plantContext, t, language]);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  const handleSendMessage = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);
    
    try {
        let messageToSend = input;
        // Add context for the first message after identification
        if (plantContext && messages.length === 1) {
            messageToSend = `I have a ${plantContext.commonName} (${plantContext.scientificName}). My question is: ${input}`;
        }

      const response = await sendMessage(messageToSend);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, t, plantContext, messages.length]);


  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col h-[70vh]">
      <div className="p-4 border-b flex items-center space-x-3 rtl:space-x-reverse">
        <ChatIcon className="w-8 h-8 text-green-primary" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">{t('chatHeader')}</h2>
          <p className="text-sm text-gray-500">{t('chatSubheader')}</p>
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs md:max-w-md ${
              msg.role === 'user'
                ? 'bg-green-primary text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800 self-start mr-auto'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
         {isTyping && <TypingIndicator />}
         {error && <div className="text-red-500 text-sm self-center">{error}</div>}
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chatPlaceholder')}
            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-primary"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-green-primary text-white p-3 rounded-full hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
