
import React, { useState, useCallback, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useUsageTracker } from '../hooks/useUsageTracker';
import { identifyPlant } from '../services/geminiService';
import type { PlantIdentificationResult } from '../types';
import PlantIcon from './icons/PlantIcon';

interface PlantIdentifierProps {
  onIdentificationComplete: (result: PlantIdentificationResult) => void;
}

const Spinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">{message}</p>
    </div>
);

const PlantIdentifier: React.FC<PlantIdentifierProps> = ({ onIdentificationComplete }) => {
  const { t, language } = useContext(AppContext);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIdentificationResult | null>(null);
  const { isLimitReached, recordUsage } = useUsageTracker();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if(selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError("File is too large. Please select a file under 10MB.");
            return;
        }
        setError(null);
        setResult(null);
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }
  };

  const handleIdentify = useCallback(async () => {
    if (!file || isLimitReached) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64String = (reader.result as string).split(',')[1];
            const identifiedResult = await identifyPlant(base64String, file.type, language);
            setResult(identifiedResult);
            recordUsage();
        };
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  }, [file, isLimitReached, recordUsage, t, language]);

  const resetState = () => {
    setImagePreview(null);
    setFile(null);
    setIsLoading(false);
    setError(null);
    setResult(null);
  }

  const renderContent = () => {
    if (isLoading) {
      return <Spinner message={t('analyzing')} />;
    }
    if (error) {
      return (
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button onClick={resetState} className="bg-green-primary hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors">
            {t('tryAgain')}
          </button>
        </div>
      );
    }
    if (result) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto text-center animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('resultHeader')}</h2>
          {imagePreview && <img src={imagePreview} alt="Identified plant" className="w-full h-56 object-cover rounded-lg mb-4" />}
          <div className="text-left space-y-3">
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
           <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
             <button onClick={resetState} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">
                {t('identify')}
            </button>
            <button onClick={() => onIdentificationComplete(result)} className="bg-green-primary hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
              {t('askAboutThisPlant')}
            </button>
          </div>
        </div>
      );
    }
     if (isLimitReached) {
        return (
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-yellow-600 mb-2">{t('limitReachedHeader')}</h2>
                <p className="text-gray-600">{t('limitReachedSubheader')}</p>
            </div>
        );
     }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto text-center">
            {imagePreview ? (
                <>
                    <img src={imagePreview} alt="Plant preview" className="w-full h-56 object-cover rounded-lg mb-4"/>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-full transition-colors">
                            <span>{t('choosePhoto')}</span>
                            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                        </label>
                        <button onClick={handleIdentify} className="bg-green-primary hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors">
                            {t('identify')}
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <PlantIcon className="w-20 h-20 text-green-accent mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">{t('uploadHeader')}</h2>
                    <p className="text-gray-600 mt-2 mb-6">{t('uploadSubheader')}</p>
                    <label className="cursor-pointer bg-green-primary hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors inline-block">
                        <span>{t('choosePhoto')}</span>
                        <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="hidden" />
                    </label>
                </>
            )}
        </div>
    );
  };
  
  return (
    <div className="w-full">
        {renderContent()}
    </div>
  );
};

export default PlantIdentifier;
