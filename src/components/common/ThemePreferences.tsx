import React, { useContext } from 'react';
import { UserContext, ColorScheme } from '../../contexts/UserContext';
import { useTranslation } from 'react-i18next';

interface ThemePreferencesProps {
  className?: string;
}

const ThemePreferences: React.FC<ThemePreferencesProps> = ({ className = '' }) => {
  const { colorScheme, setColorScheme, highContrast, setHighContrast } = useContext(UserContext);
  const { t } = useTranslation();
  const tAny = t as any;

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  const handleHighContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHighContrast(e.target.checked);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
          {tAny('theme.colorScheme')}
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <input
              id="light-mode"
              name="color-scheme"
              type="radio"
              checked={colorScheme === 'light'}
              onChange={() => handleColorSchemeChange('light')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label
              htmlFor="light-mode"
              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('theme.light')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="dark-mode"
              name="color-scheme"
              type="radio"
              checked={colorScheme === 'dark'}
              onChange={() => handleColorSchemeChange('dark')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label
              htmlFor="dark-mode"
              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('theme.dark')}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="system-mode"
              name="color-scheme"
              type="radio"
              checked={colorScheme === 'system'}
              onChange={() => handleColorSchemeChange('system')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <label
              htmlFor="system-mode"
              className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('theme.system')}
            </label>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {tAny('theme.systemHint')}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">
          {tAny('theme.accessibility')}
        </h3>

        <div className="flex items-center">
          <div className="flex items-center h-5">
            <input
              id="high-contrast"
              name="high-contrast"
              type="checkbox"
              checked={highContrast}
              onChange={handleHighContrastChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 flex items-center justify-between w-full">
            <label
              htmlFor="high-contrast"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tAny('theme.highContrast')}
            </label>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {tAny('theme.highContrastHint')}
            </span>
          </div>
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {tAny('theme.accessibilityNote')}
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 rounded-full bg-gray-900 dark:bg-white" aria-hidden="true" />
          <div className="w-6 h-6 rounded-full bg-primary-600" aria-hidden="true" />
          <div className="w-6 h-6 rounded-full bg-green-500" aria-hidden="true" />
          <div className="w-6 h-6 rounded-full bg-red-500" aria-hidden="true" />
          <div className="w-6 h-6 rounded-full bg-yellow-500" aria-hidden="true" />
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{tAny('theme.previewNote')}</p>
      </div>
    </div>
  );
};

export default ThemePreferences;
