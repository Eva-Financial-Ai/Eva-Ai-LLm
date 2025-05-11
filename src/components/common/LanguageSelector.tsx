import React from 'react';
import { useTranslation } from 'react-i18next';

type LanguageSelectorProps = {
  className?: string;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const languageCode = e.target.value;
    i18n.changeLanguage(languageCode);
    // Store language preference
    localStorage.setItem('preferredLanguage', languageCode);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        className="rounded-md border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
        value={i18n.language}
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector; 