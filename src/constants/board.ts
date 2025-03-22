export const STORAGE_KEY = 'todo-board-data';

export const PRIORITIES = ['High', 'Medium', 'Low'] as const;
export const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning'] as const;

export const COLUMN_COLORS = {
  todo: {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-pink-200 dark:border-pink-900/50',
    shadow: 'shadow-pink-100/50 dark:shadow-pink-900/20',
    header: 'bg-pink-50 dark:bg-pink-900/20',
    borderAccent: 'border-pink-200 dark:border-pink-900/50',
    itemBorder: 'border-pink-100 dark:border-pink-900/30',
    itemHoverBorder: 'hover:border-pink-200 dark:hover:border-pink-900/50',
    badge: 'bg-pink-100/50 dark:bg-pink-900/30'
  },
  inProgress: {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-blue-200 dark:border-blue-900/50',
    shadow: 'shadow-blue-100/50 dark:shadow-blue-900/20',
    header: 'bg-blue-50 dark:bg-blue-900/20',
    borderAccent: 'border-blue-200 dark:border-blue-900/50',
    itemBorder: 'border-blue-100 dark:border-blue-900/30',
    itemHoverBorder: 'hover:border-blue-200 dark:hover:border-blue-900/50',
    badge: 'bg-blue-100/50 dark:bg-blue-900/30'
  },
  complete: {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-green-200 dark:border-green-900/50',
    shadow: 'shadow-green-100/50 dark:shadow-green-900/20',
    header: 'bg-green-50 dark:bg-green-900/20',
    borderAccent: 'border-green-200 dark:border-green-900/50',
    itemBorder: 'border-green-100 dark:border-green-900/30',
    itemHoverBorder: 'hover:border-green-200 dark:hover:border-green-900/50',
    badge: 'bg-green-100/50 dark:bg-green-900/30'
  },
  uncomplete: {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-red-200 dark:border-red-900/50',
    shadow: 'shadow-red-100/50 dark:shadow-red-900/20',
    header: 'bg-red-50 dark:bg-red-900/20',
    borderAccent: 'border-red-200 dark:border-red-900/50',
    itemBorder: 'border-red-100 dark:border-red-900/30',
    itemHoverBorder: 'hover:border-red-200 dark:hover:border-red-900/50',
    badge: 'bg-red-100/50 dark:bg-red-900/30'
  },
  custom: {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-purple-200 dark:border-purple-900/50',
    shadow: 'shadow-purple-100/50 dark:shadow-purple-900/20',
    header: 'bg-purple-50 dark:bg-purple-900/20',
    borderAccent: 'border-purple-200 dark:border-purple-900/50',
    itemBorder: 'border-purple-100 dark:border-purple-900/30',
    itemHoverBorder: 'hover:border-purple-200 dark:hover:border-purple-900/50',
    badge: 'bg-purple-100/50 dark:bg-purple-900/30'
  }
} as const;

export const BACKGROUND_THEMES = {
  nature: {
    url: '/themes/nature.svg',
    bgColor: 'bg-green-50 dark:bg-green-950'
  },
  abstract: {
    url: '/themes/abstract.svg',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  geometric: {
    url: '/themes/geometric.svg',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  default: {
    url: '/themes/default.svg',
    bgColor: 'bg-gray-50 dark:bg-gray-950'
  }
} as const; 