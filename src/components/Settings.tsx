import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

export default function Settings() {
  const {
    themeMode,
    setThemeMode,
    backgroundTheme,
    setBackgroundTheme,
    backgroundMusic,
    setBackgroundMusic,
    isMusicPlaying,
    setIsMusicPlaying,
    customColumns,
    addCustomColumn,
    removeCustomColumn
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const backgroundThemes = [
    { id: 'default', name: 'Default', image: '/themes/default.svg' },
    { id: 'nature', name: 'Nature', image: '/themes/nature.svg' },
    { id: 'abstract', name: 'Abstract', image: '/themes/abstract.svg' },
    { id: 'geometric', name: 'Geometric', image: '/themes/geometric.svg' }
  ];

  const musicTracks = [
    { id: 'lofi', name: 'Lo-Fi Study', url: '/music/lofi.mp3' },
    { id: 'ambient', name: 'Ambient Nature', url: '/music/ambient.mp3' },
    { id: 'piano', name: 'Piano Relaxation', url: '/music/piano.mp3' }
  ];

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnName.trim()) {
      addCustomColumn(newColumnName.trim());
      setNewColumnName('');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Mode */}
            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Theme Mode</h3>
              <div className="flex gap-4">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setThemeMode(mode)}
                    className={`px-4 py-2 rounded-lg ${
                      themeMode === mode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Theme */}
            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Background Theme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {backgroundThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setBackgroundTheme(theme.id as any)}
                    className={`relative aspect-video rounded-lg overflow-hidden ${
                      backgroundTheme === theme.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img src={theme.image} alt={theme.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <span className="text-white font-medium">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Music */}
            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Background Music</h3>
              <div className="space-y-3">
                {musicTracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      if (backgroundMusic === track.url) {
                        setBackgroundMusic(null);
                        setIsMusicPlaying(false);
                      } else {
                        setBackgroundMusic(track.url);
                        setIsMusicPlaying(true);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg ${
                      backgroundMusic === track.url
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{track.name}</span>
                    {backgroundMusic === track.url && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMusicPlaying(!isMusicPlaying);
                        }}
                        className="p-2"
                      >
                        {isMusicPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Columns */}
            <div>
              <h3 className="text-lg font-medium mb-3 dark:text-white">Custom Columns</h3>
              <form onSubmit={handleAddColumn} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter column name..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </form>
              <div className="space-y-2">
                {customColumns.map((column) => (
                  <div
                    key={column}
                    className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="dark:text-white">{column}</span>
                    <button
                      onClick={() => removeCustomColumn(column)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 