import React from 'react';
import Board from './components/Board';
import Analytics from './components/Analytics';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider } from './contexts/AppContext';
import { logger } from './utils/logger';

const App: React.FC = () => {
  logger.info('App initialized');
  
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Board />
          <Analytics />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
