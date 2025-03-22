import { useState, useRef } from 'react';
import { TodoItem } from '../types/todo';
import ImageViewer from './ImageViewer';

interface TodoModalProps {
  todo: TodoItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTodo: TodoItem) => void;
  onDelete: (todoId: string) => void;
}

export default function TodoModal({ todo, isOpen, onClose, onSave, onDelete }: TodoModalProps) {
  const [title, setTitle] = useState(todo.text);
  const [description, setDescription] = useState(todo.description);
  const [images, setImages] = useState(todo.images);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...todo,
      text: title,
      description,
      images
    });
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
      onClose();
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => Math.min(prev + 1, images.length - 1));
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => Math.max(prev - 1, 0));
  };

  const handleCloseImageViewer = () => {
    setSelectedImageIndex(-1);
  };

  const exportData = () => {
    const data = {
      todos: columns,
      settings: {
        theme: backgroundTheme,
        customColumns,
        // other settings
      }
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString()}.json`;
    a.click();
  };

  const useAnalytics = () => {
    const trackEvent = (eventName: string, data: any) => {
      // Integration with analytics service
      logger.info('Analytics event', { eventName, data });
    };

    const trackTodoMetrics = () => {
      const metrics = {
        totalTodos: getTotalTodos(),
        completionRate: getCompletionRate(),
        averageTimeToComplete: getAverageTimeToComplete(),
      };
      trackEvent('todo_metrics', metrics);
    };

    return { trackEvent, trackTodoMetrics };
  };

  const useHistory = <T>(initialState: T) => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const undo = () => {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const redo = () => {
      if (currentIndex < history.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    return {
      state: history[currentIndex],
      undo,
      redo,
      addToHistory: (newState: T) => {
        setHistory(prev => [...prev.slice(0, currentIndex + 1), newState]);
        setCurrentIndex(prev => prev + 1);
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Edit Todo</h2>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Todo
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Todo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
                        onClick={() => handleImageClick(index)}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <ImageViewer
        images={images}
        currentIndex={selectedImageIndex}
        isOpen={selectedImageIndex >= 0}
        onClose={handleCloseImageViewer}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
} 