import React, { useState, useEffect } from 'react';

interface AccessibilityControlsProps {
  className?: string;
}

/**
 * AccessibilityControls - Allows users to adjust UI size and contrast for better accessibility
 */
const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ className = '' }) => {
  const [fontSize, setFontSize] = useState<string>(() => {
    return localStorage.getItem('eva-font-size') || 'medium';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('eva-high-contrast') === 'true';
  });

  // Apply font size changes
  useEffect(() => {
    const html = document.documentElement;

    // Remove any existing font size classes
    html.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xl');

    // Add the selected font size class
    html.classList.add(`text-size-${fontSize}`);

    // Save preference to localStorage
    localStorage.setItem('eva-font-size', fontSize);

    // Apply specific font size values based on selection
    switch (fontSize) {
      case 'small':
        html.style.fontSize = '14px';
        break;
      case 'medium':
        html.style.fontSize = '16px';
        break;
      case 'large':
        html.style.fontSize = '18px';
        break;
      case 'xl':
        html.style.fontSize = '20px';
        break;
      default:
        html.style.fontSize = '16px';
    }
  }, [fontSize]);

  // Apply contrast changes
  useEffect(() => {
    const body = document.body;

    if (highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Save preference to localStorage
    localStorage.setItem('eva-high-contrast', highContrast.toString());
  }, [highContrast]);

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Accessibility Settings</h3>

      <div className="mb-4">
        <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 mb-2">
          Text Size
        </label>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFontSize('small')}
            className={`px-3 py-2 rounded-md ${
              fontSize === 'small'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={fontSize === 'small'}
          >
            Small
          </button>
          <button
            onClick={() => setFontSize('medium')}
            className={`px-3 py-2 rounded-md ${
              fontSize === 'medium'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={fontSize === 'medium'}
          >
            Medium
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-3 py-2 rounded-md ${
              fontSize === 'large'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={fontSize === 'large'}
          >
            Large
          </button>
          <button
            onClick={() => setFontSize('xl')}
            className={`px-3 py-2 rounded-md ${
              fontSize === 'xl'
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={fontSize === 'xl'}
          >
            Extra Large
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center">
          <input
            id="high-contrast"
            type="checkbox"
            checked={highContrast}
            onChange={e => setHighContrast(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="high-contrast" className="ml-2 block text-sm text-gray-700">
            High Contrast Mode
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">Increases contrast for better readability</p>
      </div>
    </div>
  );
};

export default AccessibilityControls;
