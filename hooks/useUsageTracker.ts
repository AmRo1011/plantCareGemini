
import { useState, useCallback, useEffect } from 'react';
import { GUEST_USAGE_LIMIT } from '../constants';

const USAGE_KEY = 'plantCareUsage';

interface UsageData {
  count: number;
  lastReset: number;
}

export const useUsageTracker = () => {
  const [usageData, setUsageData] = useState<UsageData>({ count: 0, lastReset: Date.now() });

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(USAGE_KEY);
      if (storedData) {
        const parsedData: UsageData = JSON.parse(storedData);
        const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsedData.lastReset > thirtyDaysInMillis) {
          // Reset if it's been more than 30 days
          const freshData = { count: 0, lastReset: Date.now() };
          localStorage.setItem(USAGE_KEY, JSON.stringify(freshData));
          setUsageData(freshData);
        } else {
          setUsageData(parsedData);
        }
      } else {
        // Initialize if no data exists
        localStorage.setItem(USAGE_KEY, JSON.stringify({ count: 0, lastReset: Date.now() }));
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  const remainingUses = GUEST_USAGE_LIMIT - usageData.count;
  const isLimitReached = usageData.count >= GUEST_USAGE_LIMIT;

  const recordUsage = useCallback(() => {
    if (isLimitReached) return;
    
    setUsageData(prevData => {
      const newData = { ...prevData, count: prevData.count + 1 };
      try {
        localStorage.setItem(USAGE_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error("Could not write to localStorage:", error);
      }
      return newData;
    });
  }, [isLimitReached]);

  return { remainingUses, isLimitReached, recordUsage };
};
