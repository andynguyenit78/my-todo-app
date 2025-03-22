import { useEffect, useCallback } from 'react';
import { BoardData, TodoItem } from '../types/todo';

interface UseKeyboardNavigationProps {
  columns: BoardData;
  selectedTodo: TodoItem | null;
  handleTodoClick: (todo: TodoItem) => void;
  handleModalClose: () => void;
}

export function useKeyboardNavigation({
  columns,
  selectedTodo,
  handleTodoClick,
  handleModalClose
}: UseKeyboardNavigationProps) {
  const findTodoPosition = useCallback((todo: TodoItem) => {
    for (const [columnId, column] of Object.entries(columns)) {
      const index = column.items.findIndex(item => item.id === todo.id);
      if (index !== -1) {
        return { columnId, index };
      }
    }
    return null;
  }, [columns]);

  const findNextTodo = useCallback((currentTodo: TodoItem, direction: 'up' | 'down' | 'left' | 'right') => {
    const position = findTodoPosition(currentTodo);
    if (!position) return null;

    const columnIds = Object.keys(columns);
    const currentColumnIndex = columnIds.indexOf(position.columnId);

    switch (direction) {
      case 'up': {
        if (position.index > 0) {
          return columns[position.columnId].items[position.index - 1];
        }
        return null;
      }
      case 'down': {
        if (position.index < columns[position.columnId].items.length - 1) {
          return columns[position.columnId].items[position.index + 1];
        }
        return null;
      }
      case 'left': {
        if (currentColumnIndex > 0) {
          const leftColumnId = columnIds[currentColumnIndex - 1];
          const leftColumn = columns[leftColumnId];
          return leftColumn.items[Math.min(position.index, leftColumn.items.length - 1)] || null;
        }
        return null;
      }
      case 'right': {
        if (currentColumnIndex < columnIds.length - 1) {
          const rightColumnId = columnIds[currentColumnIndex + 1];
          const rightColumn = columns[rightColumnId];
          return rightColumn.items[Math.min(position.index, rightColumn.items.length - 1)] || null;
        }
        return null;
      }
      default:
        return null;
    }
  }, [columns, findTodoPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTodo) return;

      let nextTodo: TodoItem | null = null;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          nextTodo = findNextTodo(selectedTodo, 'up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          nextTodo = findNextTodo(selectedTodo, 'down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextTodo = findNextTodo(selectedTodo, 'left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTodo = findNextTodo(selectedTodo, 'right');
          break;
        case 'Escape':
          e.preventDefault();
          handleModalClose();
          break;
      }

      if (nextTodo) {
        handleTodoClick(nextTodo);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTodo, findNextTodo, handleTodoClick, handleModalClose]);
} 