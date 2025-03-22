import React, { useState, useEffect } from 'react';
import { analytics } from '../services/analytics';
import { useTodoBoard } from '../hooks/useTodoBoard';
import { useApp } from '../contexts/AppContext';

export default function Analytics() {
  const [isOpen, setIsOpen] = useState(false);
  const { customColumns, themeMode } = useApp();
  const { columns } = useTodoBoard(customColumns);
  const [metrics, setMetrics] = useState(analytics.calculateTodoMetrics(columns));

  useEffect(() => {
    setMetrics(analytics.calculateTodoMetrics(columns));
  }, [columns]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        aria-label="Open Analytics"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>
    );
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
        themeMode === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Overview Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Overview</h3>
              <div className="space-y-2">
                <p>Total Todos: {metrics.totalTodos}</p>
                <p>Completed: {metrics.completedTodos}</p>
                <p>Completion Rate: {metrics.completionRate.toFixed(1)}%</p>
                <p>Avg. Time to Complete: {formatTime(metrics.averageTimeToComplete)}</p>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Priority Distribution</h3>
              <div className="space-y-2">
                {Object.entries(metrics.todosByPriority).map(([priority, count]) => (
                  <div key={priority} className="flex justify-between items-center">
                    <span className="capitalize">{priority}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Category Distribution</h3>
              <div className="space-y-2">
                {Object.entries(metrics.todosByCategory).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="capitalize">{category}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Distribution */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Column Distribution</h3>
              <div className="space-y-2">
                {Object.entries(columns).map(([columnId, column]) => (
                  <div key={columnId} className="flex justify-between items-center">
                    <span className="capitalize">{column.title}</span>
                    <span className="font-medium">{column.items.length}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg col-span-2">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {Object.values(columns)
                  .flatMap(column => column.items)
                  .filter(todo => todo.updatedAt) // Only show todos with valid updatedAt
                  .sort((a, b) => {
                    const dateA = new Date(a.updatedAt || 0).getTime();
                    const dateB = new Date(b.updatedAt || 0).getTime();
                    return dateB - dateA;
                  })
                  .slice(0, 5)
                  .map(todo => (
                    <div key={todo.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium truncate">{todo.text}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last updated: {formatDate(todo.updatedAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        todo.status === 'complete' 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
                      }`}>
                        {todo.status}
                      </span>
                    </div>
                  ))}
                {Object.values(columns)
                  .flatMap(column => column.items)
                  .filter(todo => todo.updatedAt).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 