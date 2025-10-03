export interface PlantIdentificationResult {
  commonName: string;
  scientificName: string;
  careGuide: {
    watering: string;
    sunlight: string;
    soil: string;
  };
  confidenceScore: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface HistoryItem {
  id: number;
  date: string;
  image: string;
  plant: PlantIdentificationResult;
  chat: ChatMessage[];
}

export enum View {
  IDENTIFY = 'IDENTIFY',
  CHAT = 'CHAT',
  HISTORY = 'HISTORY',
}
