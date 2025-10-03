import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '../types';

const HISTORY_KEY = 'plantCareHistory';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  const addHistoryItem = useCallback((item: HistoryItem) => {
    // Prevent adding sessions without a plant or with only the initial bot message
    if (!item.plant || item.chat.length <= 1) return;

    setHistory(prevHistory => {
      // Avoid duplicates
      if (prevHistory.some(h => h.id === item.id)) {
        return prevHistory;
      }
      const updatedHistory = [item, ...prevHistory];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
      return updatedHistory;
    });
  }, []);

  return { history, addHistoryItem };
};
