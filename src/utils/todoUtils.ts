import { TodoItem } from '../types/todo';
import { PRIORITIES, CATEGORIES } from '../constants/board';

export const generateInitialTodos = (status: string, count: number): TodoItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${status}-${i + 1}`,
    text: `${CATEGORIES[i % CATEGORIES.length]} - ${status} task ${i + 1}`,
    description: `Priority: ${PRIORITIES[i % PRIORITIES.length]}. This is a detailed description for the ${status} task ${i + 1}. It includes multiple lines of text to demonstrate how the description appears in the card.`,
    images: i % 3 === 0 ? [
      `https://picsum.photos/seed/${status}${i}/300/200`,
      `https://picsum.photos/seed/${status}${i + 1}/300/200`
    ] : [],
    status,
    priority: PRIORITIES[i % PRIORITIES.length],
    category: CATEGORIES[i % CATEGORIES.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

export const getColumnColors = (columnId: string) => {
  const defaultColors = {
    base: 'bg-white dark:bg-gray-800',
    border: 'border-purple-200 dark:border-purple-900/50',
    shadow: 'shadow-purple-100/50 dark:shadow-purple-900/20',
    header: 'bg-purple-50 dark:bg-purple-900/20',
    borderAccent: 'border-purple-200 dark:border-purple-900/50',
    itemBorder: 'border-purple-100 dark:border-purple-900/30',
    itemHoverBorder: 'hover:border-purple-200 dark:hover:border-purple-900/50',
    badge: 'bg-purple-100/50 dark:bg-purple-900/30'
  };

  switch (columnId) {
    case 'todo':
      return {
        base: 'bg-white dark:bg-gray-800',
        border: 'border-pink-200 dark:border-pink-900/50',
        shadow: 'shadow-pink-100/50 dark:shadow-pink-900/20',
        header: 'bg-pink-50 dark:bg-pink-900/20',
        borderAccent: 'border-pink-200 dark:border-pink-900/50',
        itemBorder: 'border-pink-100 dark:border-pink-900/30',
        itemHoverBorder: 'hover:border-pink-200 dark:hover:border-pink-900/50',
        badge: 'bg-pink-100/50 dark:bg-pink-900/30'
      };
    case 'inProgress':
      return {
        base: 'bg-white dark:bg-gray-800',
        border: 'border-blue-200 dark:border-blue-900/50',
        shadow: 'shadow-blue-100/50 dark:shadow-blue-900/20',
        header: 'bg-blue-50 dark:bg-blue-900/20',
        borderAccent: 'border-blue-200 dark:border-blue-900/50',
        itemBorder: 'border-blue-100 dark:border-blue-900/30',
        itemHoverBorder: 'hover:border-blue-200 dark:hover:border-blue-900/50',
        badge: 'bg-blue-100/50 dark:bg-blue-900/30'
      };
    case 'complete':
      return {
        base: 'bg-white dark:bg-gray-800',
        border: 'border-green-200 dark:border-green-900/50',
        shadow: 'shadow-green-100/50 dark:shadow-green-900/20',
        header: 'bg-green-50 dark:bg-green-900/20',
        borderAccent: 'border-green-200 dark:border-green-900/50',
        itemBorder: 'border-green-100 dark:border-green-900/30',
        itemHoverBorder: 'hover:border-green-200 dark:hover:border-green-900/50',
        badge: 'bg-green-100/50 dark:bg-green-900/30'
      };
    case 'uncomplete':
      return {
        base: 'bg-white dark:bg-gray-800',
        border: 'border-red-200 dark:border-red-900/50',
        shadow: 'shadow-red-100/50 dark:shadow-red-900/20',
        header: 'bg-red-50 dark:bg-red-900/20',
        borderAccent: 'border-red-200 dark:border-red-900/50',
        itemBorder: 'border-red-100 dark:border-red-900/30',
        itemHoverBorder: 'hover:border-red-200 dark:hover:border-red-900/50',
        badge: 'bg-red-100/50 dark:bg-red-900/30'
      };
    default:
      return defaultColors;
  }
}; 