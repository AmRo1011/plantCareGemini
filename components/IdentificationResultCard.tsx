import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { PlantIdentificationResult } from '../types';

interface IdentificationResultCardProps {
  result: PlantIdentificationResult;
  image: string;
}

const IdentificationResultCard: React.FC<IdentificationResultCardProps> = ({ result, image }) => {
  const { t } = useContext(AppContext);
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('resultHeader')}</h2>
      <img src={image} alt="Identified plant" className="w-full h-56 object-cover rounded-lg mb-4" />
      <div className="text-left space-y-3 rtl:text-right">
        <p><strong>{t('commonName')}:</strong> {result.commonName}</p>
        <p><strong>{t('scientificName')}:</strong> <em className="italic">{result.scientificName}</em></p>
        <p><strong>{t('confidence')}:</strong> {Math.round(result.confidenceScore * 100)}%</p>
        <div>
          <h3 className="font-bold mt-4 mb-2">{t('careGuide')}</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li><strong>{t('watering')}:</strong> {result.careGuide.watering}</li>
            <li><strong>{t('sunlight')}:</strong> {result.careGuide.sunlight}</li>
            <li><strong>{t('soil')}:</strong> {result.careGuide.soil}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IdentificationResultCard;
