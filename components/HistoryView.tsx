import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { HistoryItem } from '../types';
import IdentificationResultCard from './IdentificationResultCard';

interface HistoryViewProps {
  history: HistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { direction } = useContext(AppContext);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (history.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No History Yet</h2>
        <p className="text-gray-600">Your past plant identifications will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {history.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => toggleExpand(item.id)}
            className="w-full text-left rtl:text-right p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            aria-expanded={expandedId === item.id}
          >
            <div>
              <p className="font-bold text-lg text-green-primary">{item.plant.commonName}</p>
              <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-6 h-6 text-gray-500 transition-transform ${
                expandedId === item.id ? 'rotate-180' : ''
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {expandedId === item.id && (
            <div className="p-4 border-t bg-gray-50/50">
              <IdentificationResultCard result={item.plant} image={item.image} />
              <div className="mt-6 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Chat History</h3>
                <div className="space-y-4 flex flex-col max-h-96 overflow-y-auto p-2 bg-white rounded-lg">
                  {item.chat.map((msg, index) => (
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
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryView;
