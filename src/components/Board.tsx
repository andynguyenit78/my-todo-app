import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useApp } from '../contexts/AppContext';
import { useTodoBoard } from '../hooks/useTodoBoard';
import TodoModal from './TodoModal';
import Settings from './Settings';
import BackgroundMusic from './BackgroundMusic';
import { BACKGROUND_THEMES } from '../constants/board';
import { getColumnColors } from '../utils/todoUtils';

export default function Board() {
  const { backgroundTheme, customColumns } = useApp();
  const {
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
    handleDragEnd
  } = useTodoBoard(customColumns);

  const getBackgroundStyle = () => {
    const theme = BACKGROUND_THEMES[backgroundTheme] || BACKGROUND_THEMES.default;
    return `bg-cover bg-center bg-fixed bg-[url("${theme.url}")] ${theme.bgColor}`;
  };

  return (
    <div className={getBackgroundStyle()}>
      <div className="h-screen flex flex-col overflow-hidden bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 flex flex-col flex-1 min-h-0">
          <div className="flex items-center mb-8 flex-shrink-0">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 whitespace-nowrap">Todo Board</h1>
            <div className="flex-1 flex justify-center">
              <div className="w-96 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full px-6 py-3 pl-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="w-[200px]"></div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0"
                >
                  {Object.entries(filteredColumns).map(([columnId, column], index) => {
                    const colors = getColumnColors(columnId);
                    return (
                      <Draggable key={columnId} draggableId={columnId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="h-full min-h-0"
                          >
                            <div
                              className={`${colors.base} rounded-2xl shadow-lg overflow-hidden border-2 ${colors.border} ${colors.shadow} h-full flex flex-col`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={`p-4 flex-shrink-0 ${colors.header} border-b-2 ${colors.borderAccent} cursor-move`}
                              >
                                <div className="flex items-center justify-between">
                                  <h2 className="font-semibold text-lg dark:text-white flex items-center gap-2">
                                    {column.title}
                                    <span className={`text-sm font-normal px-2 py-1 rounded-full ${colors.badge}`}>
                                      {column.items.length}
                                    </span>
                                  </h2>
                                  <div className="text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 flex flex-col min-h-0 relative">
                                <Droppable droppableId={columnId} type="todo">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={`flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500 ${columnId === 'todo' ? 'pb-20' : ''} ${
                                        snapshot.isDraggingOver ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                                      }`}
                                    >
                                      {column.items.map((item, index) => (
                                        <Draggable
                                          key={item.id}
                                          draggableId={item.id}
                                          index={index}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              onClick={() => handleTodoClick(item)}
                                              style={{
                                                ...provided.draggableProps.style,
                                                opacity: snapshot.isDragging ? 0.5 : 1
                                              }}
                                              className={`group/item bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-3 cursor-move hover:shadow-lg transition-all duration-200 border ${colors.itemBorder} ${colors.itemHoverBorder}`}
                                            >
                                              <div className="font-medium dark:text-white flex items-start justify-between gap-2">
                                                <span className="line-clamp-2">{item.text}</span>
                                                <span className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                  </svg>
                                                </span>
                                              </div>
                                              {item.description && (
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                  {item.description}
                                                </div>
                                              )}
                                              {item.images.length > 0 && (
                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                  {item.images.slice(0, 2).map((image, index) => (
                                                    <div key={index} className="relative group/image rounded-lg overflow-hidden">
                                                      <img
                                                        src={image}
                                                        alt={`Todo ${index + 1}`}
                                                        className="w-full h-24 object-cover transition-transform duration-200 group-hover/image:scale-110"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          handleTodoClick(item);
                                                        }}
                                                      />
                                                      <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-200" />
                                                    </div>
                                                  ))}
                                                  {item.images.length > 2 && (
                                                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                                                      +{item.images.length - 2}
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                                {columnId === 'todo' && (
                                  <div className="absolute bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-800 border-t-2 border-pink-100 dark:border-pink-900/30 rounded-b-2xl">
                                    <form onSubmit={addTodo}>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          value={input}
                                          onChange={(e) => setInput(e.target.value)}
                                          placeholder="Add new task..."
                                          className="w-full px-4 py-2 border-2 border-pink-100 dark:border-pink-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                                        />
                                        <button
                                          type="submit"
                                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-md hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 text-sm font-medium"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {selectedTodo && (
            <TodoModal
              todo={selectedTodo}
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onSave={handleTodoUpdate}
              onDelete={handleTodoDelete}
            />
          )}
        </div>
      </div>
      <Settings />
      <BackgroundMusic />
    </div>
  );
} 