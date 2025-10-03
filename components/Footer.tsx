
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Footer: React.FC = () => {
  const { t } = useContext(AppContext);

  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500">
        <p>{t('footerText')}</p>
      </div>
    </footer>
  );
};

export default Footer;
