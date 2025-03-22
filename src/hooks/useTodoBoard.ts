import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TodoItem, BoardData, ColumnType, DragResult } from '../types/todo';
import { STORAGE_KEY, COLUMN_COLORS, PRIORITIES, CATEGORIES } from '../constants/board';
import { generateInitialTodos } from '../utils/todoUtils';
import { logger } from '../utils/logger';
import { analytics } from '../services/analytics';

interface ColumnData {
  id: string;
  title: string;
  items: TodoItem[];
  color: string;
}

const defaultColumns = (customColumns: string[] = []): BoardData => {
  const defaultCols: Record<string, ColumnData> = {
    todo: {
      id: 'todo',
      title: 'To Do',
      items: generateInitialTodos('todo', 20),
      color: `${COLUMN_COLORS.todo.base} ${COLUMN_COLORS.todo.border} ${COLUMN_COLORS.todo.shadow}`
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      items: generateInitialTodos('inProgress', 20),
      color: `${COLUMN_COLORS.inProgress.base} ${COLUMN_COLORS.inProgress.border} ${COLUMN_COLORS.inProgress.shadow}`
    },
    complete: {
      id: 'complete',
      title: 'Complete',
      items: generateInitialTodos('complete', 20),
      color: `${COLUMN_COLORS.complete.base} ${COLUMN_COLORS.complete.border} ${COLUMN_COLORS.complete.shadow}`
    },
    uncomplete: {
      id: 'uncomplete',
      title: 'Uncomplete',
      items: generateInitialTodos('uncomplete', 20),
      color: `${COLUMN_COLORS.uncomplete.base} ${COLUMN_COLORS.uncomplete.border} ${COLUMN_COLORS.uncomplete.shadow}`
    }
  };

  // Add custom columns
  customColumns.forEach((columnName) => {
    defaultCols[columnName] = {
      id: columnName,
      title: columnName,
      items: [],
      color: `${COLUMN_COLORS.todo.base} ${COLUMN_COLORS.todo.border} ${COLUMN_COLORS.todo.shadow}`
    };
  });

  return defaultCols;
};

export function useTodoBoard(customColumns: string[] = []) {
  const [columns, setColumns] = useLocalStorage<BoardData>(STORAGE_KEY, defaultColumns(customColumns));
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    analytics.trackUserSession();
  }, []);

  useEffect(() => {
    setColumns(prev => {
      const newColumns = { ...prev };
      
      Object.keys(newColumns).forEach(columnId => {
        if (!['todo', 'inProgress', 'complete', 'uncomplete'].includes(columnId) && 
            !customColumns.includes(columnId)) {
          delete newColumns[columnId];
        }
      });

      customColumns.forEach(columnName => {
        if (!newColumns[columnName]) {
          newColumns[columnName] = {
            id: columnName,
            title: columnName,
            items: [],
            color: `${COLUMN_COLORS.todo.base} ${COLUMN_COLORS.todo.border} ${COLUMN_COLORS.todo.shadow}`
          };
        }
      });

      return newColumns;
    });
  }, [customColumns, setColumns]);

  const handleTodoClick = useCallback((todo: TodoItem) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
    logger.info('Todo selected', { todoId: todo.id });
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedTodo(null);
    setIsModalOpen(false);
    logger.info('Modal closed');
  }, []);

  const handleTodoUpdate = useCallback((updatedTodo: TodoItem) => {
    try {
      setColumns(prev => {
        const columnId = updatedTodo.status;
        const column = prev[columnId];
        const updatedItems = column.items.map(item =>
          item.id === updatedTodo.id ? { ...updatedTodo, updatedAt: new Date().toISOString() } : item
        );

        const newColumns = {
          ...prev,
          [columnId]: {
            ...column,
            items: updatedItems
          }
        };

        const oldTodo = column.items.find(item => item.id === updatedTodo.id);
        if (oldTodo) {
          analytics.trackTodoUpdated(oldTodo, updatedTodo);
        }

        return newColumns;
      });
      logger.info('Todo updated', { todoId: updatedTodo.id });
    } catch (error) {
      logger.error('Error updating todo', error);
    }
  }, [setColumns]);

  const handleTodoDelete = useCallback((todoId: string) => {
    try {
      setColumns(prev => {
        const newColumns = { ...prev };
        Object.keys(newColumns).forEach(columnId => {
          const todoToDelete = newColumns[columnId].items.find(item => item.id === todoId);
          if (todoToDelete) {
            analytics.trackTodoDeleted(todoToDelete);
          }
          newColumns[columnId].items = newColumns[columnId].items.filter(
            item => item.id !== todoId
          );
        });
        return newColumns;
      });
      logger.info('Todo deleted', { todoId });
    } catch (error) {
      logger.error('Error deleting todo', error);
    }
  }, [setColumns]);

  const addTodo = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: input.trim(),
        description: '',
        images: [],
        status: 'todo',
        priority: PRIORITIES[0],
        category: CATEGORIES[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setColumns(prev => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: [...prev.todo.items, newTodo]
        }
      }));
      setInput('');
      analytics.trackTodoCreated(newTodo);
      logger.info('New todo added', { todoId: newTodo.id });
    }
  }, [input, setColumns]);

  const handleDragEnd = useCallback((result: DragResult) => {
    try {
      const { destination, source, draggableId, type } = result;

      if (!destination) {
        logger.info('Drag ended with no destination');
        return;
      }

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        logger.info('Drag ended at same position');
        return;
      }

      if (type === 'column') {
        setColumns(prev => {
          const columnOrder = Object.keys(prev);
          columnOrder.splice(source.index, 1);
          columnOrder.splice(destination.index, 0, draggableId);
          
          const reorderedColumns: BoardData = {};
          columnOrder.forEach(columnId => {
            reorderedColumns[columnId] = prev[columnId];
          });
          
          return reorderedColumns;
        });
        logger.info('Column reordered', { columnId: draggableId, from: source.index, to: destination.index });
        return;
      }

      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const draggedTodo = sourceColumn.items.find(todo => todo.id === draggableId);

      if (!draggedTodo) {
        logger.error('Dragged todo not found', { draggableId, sourceColumn });
        return;
      }

      const newSourceItems = sourceColumn.items.filter(todo => todo.id !== draggableId);
      const newDestItems = [...destColumn.items];
      const updatedTodo = { ...draggedTodo, status: destination.droppableId, updatedAt: new Date().toISOString() };
      newDestItems.splice(destination.index, 0, updatedTodo);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: {
          ...sourceColumn,
          items: newSourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: newDestItems
        }
      }));

      analytics.trackTodoMoved(draggableId, source.droppableId, destination.droppableId);
      logger.info('Todo moved successfully', {
        todoId: draggableId,
        from: source.droppableId,
        to: destination.droppableId
      });
    } catch (error) {
      logger.error('Error during drag and drop operation', error);
    }
  }, [columns, setColumns]);

  const filteredColumns = Object.entries(columns).reduce<BoardData>((acc, [key, column]) => {
    const filteredItems = column.items.filter(
      item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
      ...acc,
      [key]: {
        ...column,
        items: filteredItems
      }
    };
  }, {} as BoardData);

  const getTotalTodos = useCallback(() => {
    return Object.values(columns).reduce((total, column) => total + column.items.length, 0);
  }, [columns]);

  return {
    columns: filteredColumns,
    selectedTodo,
    isModalOpen,
    input,
    searchTerm,
    setSearchTerm,
    setInput,
    handleTodoClick,
    handleModalClose,
    handleTodoUpdate,
    handleTodoDelete,
    addTodo,
    handleDragEnd,
    getTotalTodos
  };
} 