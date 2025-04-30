// Form validation constants
export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 30;

// Countdown constants
export const COUNTDOWN_INTERVAL = 1000;
export const DEFAULT_COUNTDOWN_DURATION = 10000; // 10 seconds

// Error messages
export const ERROR_MESSAGES = {
  TITLE: {
    REQUIRED: 'Title is required',
    MIN_LENGTH: 'Title must be at least 3 characters long',
    MAX_LENGTH: 'Title cannot exceed 30 characters',
    PATTERN:
      'Title can only contain letters, numbers, spaces, hyphens, and quotes',
  },
  DATE: {
    REQUIRED: 'Please select a date',
    MIN: 'Please select a future date',
  },
} as const;
