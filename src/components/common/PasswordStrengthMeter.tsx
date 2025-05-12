import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
}) => {
  const { t } = useTranslation();

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!password) return 0;

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

    // Variety check
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 1;

    // Normalize score to 0-4 range
    return Math.min(4, Math.floor(score / 2));
  }, [password]);

  // Define strength labels and colors
  const strengthLabels = [
    t('password.veryWeak', 'Very Weak'),
    t('password.weak', 'Weak'),
    t('password.fair', 'Fair'),
    t('password.good', 'Good'),
    t('password.strong', 'Strong'),
  ];

  const strengthClasses = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];

  // Get current strength info
  const currentStrength = {
    label: strengthLabels[passwordStrength],
    color: strengthClasses[passwordStrength],
  };

  // Return password criteria
  const passwordCriteria = useMemo(() => {
    return [
      {
        label: t('password.criteria.length', 'At least 8 characters'),
        met: password.length >= 8,
      },
      {
        label: t('password.criteria.uppercase', 'Contains uppercase letter'),
        met: /[A-Z]/.test(password),
      },
      {
        label: t('password.criteria.lowercase', 'Contains lowercase letter'),
        met: /[a-z]/.test(password),
      },
      {
        label: t('password.criteria.number', 'Contains number'),
        met: /[0-9]/.test(password),
      },
      {
        label: t('password.criteria.special', 'Contains special character'),
        met: /[^A-Za-z0-9]/.test(password),
      },
    ];
  }, [password, t]);

  return (
    <div className={`password-strength-meter ${className}`}>
      {/* Strength meter bars */}
      <div className="flex mb-2 h-1.5 gap-1">
        {[0, 1, 2, 3, 4].map(index => (
          <div
            key={index}
            className={`h-full rounded-full flex-1 transition-all duration-300 ${
              index <= passwordStrength
                ? strengthClasses[passwordStrength]
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Strength label */}
      <p className={`text-sm font-medium mb-3`} aria-live="polite">
        {t('password.strength', 'Password strength')}:
        <span
          className={`ml-1 ${
            passwordStrength <= 1
              ? 'text-red-600 dark:text-red-400'
              : passwordStrength === 2
                ? 'text-yellow-600 dark:text-yellow-400'
                : passwordStrength >= 3
                  ? 'text-green-600 dark:text-green-400'
                  : ''
          }`}
        >
          {currentStrength.label}
        </span>
      </p>

      {/* Requirements list */}
      <ul className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
        {passwordCriteria.map((criterion, i) => (
          <li
            key={i}
            className={`flex items-center gap-1 ${criterion.met ? 'text-green-600 dark:text-green-400' : ''}`}
          >
            {criterion.met ? (
              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01"
                />
              </svg>
            )}
            {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter;
