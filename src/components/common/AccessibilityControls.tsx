import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../contexts/UserContext';

interface AccessibilityControlsProps {
  className?: string;
}

/**
 * AccessibilityControls - Allows users to adjust UI size and contrast for better accessibility
 */
const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const userContext = useContext(UserContext);

  // Font size control
  const [fontSize, setFontSize] = useState<number>(1);

  // Apply font size to document root
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = `${fontSize}rem`;

    // Save to localStorage
    localStorage.setItem('accessibility_fontSize', fontSize.toString());

    return () => {
      // Clean up when component unmounts
      html.style.fontSize = '1rem';
    };
  }, [fontSize]);

  // Load saved font size on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility_fontSize');
    if (savedFontSize) {
      setFontSize(parseFloat(savedFontSize));
    }
  }, []);

  // Handle theme toggle (dark mode)
  const handleThemeToggle = () => {
    const newTheme = userContext?.theme === 'dark' ? 'light' : 'dark';
    userContext?.setTheme?.(newTheme);
  };

  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize(prev => Math.min(prev + 0.1, 1.5));
    }
  };

  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize(prev => Math.max(prev - 0.1, 0.8));
    }
  };

  // Reset font size
  const resetFontSize = () => {
    setFontSize(1);
  };

  return (
    <div className={`accessibility-controls ${className}`}>
      {/* Theme toggle (dark mode) */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('accessibility.theme', 'Color Theme')}
        </h3>

        <div className="flex items-center">
          <button
            type="button"
            onClick={handleThemeToggle}
            className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            role="switch"
            aria-checked={userContext?.theme === 'dark'}
            style={{
              backgroundColor: userContext?.theme === 'dark' ? '#4F46E5' : '#E5E7EB',
            }}
          >
            <span className="sr-only">{t('accessibility.toggleDarkMode', 'Toggle dark mode')}</span>
            <span
              aria-hidden="true"
              className={`translate-x-0 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                userContext?.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></span>
          </button>
          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {userContext?.theme === 'dark'
              ? t('accessibility.darkMode', 'Dark Mode')
              : t('accessibility.lightMode', 'Light Mode')}
          </span>
        </div>
      </div>

      {/* Font size controls */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('accessibility.fontSize', 'Font Size')}
        </h3>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={decreaseFontSize}
            disabled={fontSize <= 0.8}
            aria-label={t('accessibility.decreaseFontSize', 'Decrease font size')}
            className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={resetFontSize}
            disabled={fontSize === 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
          >
            {t('accessibility.resetFontSize', 'Reset')}
          </button>

          <button
            type="button"
            onClick={increaseFontSize}
            disabled={fontSize >= 1.5}
            aria-label={t('accessibility.increaseFontSize', 'Increase font size')}
            className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {Math.round(fontSize * 100)}%
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {t(
            'accessibility.fontSizeDescription',
            'Adjust the font size to make content easier to read.'
          )}
        </p>
      </div>
    </div>
  );
};

export default AccessibilityControls;
