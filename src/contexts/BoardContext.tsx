import React, { createContext, useCallback, useState } from 'react';
import { BoardState, Column, BoardTheme } from '../types/board';

interface BoardContextType extends BoardState {
  updateColumn: (columnId: string, column: Column) => void;
  updateTheme: (theme: BoardTheme) => void;
  addCustomColumn: (column: Column) => void;
  removeCustomColumn: (columnId: string) => void;
}

export const BoardContext = createContext<BoardContextType | null>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BoardState>({
    columns: {},
    backgroundTheme: {
      id: 'default',
      name: 'Default',
      backgroundImage: '',
      darkMode: false
    },
    customColumns: []
  });

  const updateColumn = useCallback((columnId: string, column: Column) => {
    setState(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: column
      }
    }));
  }, []);

  const updateTheme = useCallback((theme: BoardTheme) => {
    setState(prev => ({
      ...prev,
      backgroundTheme: theme
    }));
  }, []);

  const addCustomColumn = useCallback((column: Column) => {
    setState(prev => ({
      ...prev,
      customColumns: [...prev.customColumns, column]
    }));
  }, []);

  const removeCustomColumn = useCallback((columnId: string) => {
    setState(prev => ({
      ...prev,
      customColumns: prev.customColumns.filter(col => col.id !== columnId)
    }));
  }, []);

  return (
    <BoardContext.Provider
      value={{
        ...state,
        updateColumn,
        updateTheme,
        addCustomColumn,
        removeCustomColumn
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}; 