# Modern Todo Board Application

A feature-rich, modern todo application built with React, TypeScript, and Tailwind CSS. This application provides an intuitive drag-and-drop interface for task management, real-time analytics, and a beautiful, responsive design.

## 🌟 Features

### Task Management
- **Drag-and-Drop Interface**: Easily move tasks between different status columns
- **Custom Columns**: Create and manage custom columns beyond the default ones
- **Rich Task Details**: 
  - Task title and description
  - Multiple image attachments
  - Priority levels
  - Categories
  - Status tracking
  - Timestamps for creation and updates

### Visual Organization
- **Column-based Layout**: 
  - Todo
  - In Progress
  - Complete
  - Uncomplete
  - Custom columns
- **Image Management**:
  - Upload multiple images per task
  - Image preview in cards
  - Grid view in task modal
  - Image deletion

### Analytics Dashboard
- **Real-time Metrics**:
  - Total tasks and completion rates
  - Average completion time
  - Priority distribution
  - Category distribution
  - Column distribution
- **Activity Timeline**: Track recent task updates and changes
- **Visual Data Representation**: Clean and intuitive presentation of statistics

### Customization
- **Theme Support**:
  - Light/Dark mode
  - System theme detection
  - Custom background themes
- **Background Music**:
  - Multiple audio tracks
  - Play/pause controls
  - Volume management

### Advanced Features
- **Search Functionality**: Search across all tasks and columns
- **Data Persistence**: Automatic saving to localStorage
- **Error Handling**: Graceful error management with error boundaries
- **Analytics Tracking**: Comprehensive event and metrics tracking
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/my-todo-app.git
cd my-todo-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Usage

### Managing Tasks

1. **Creating a Task**:
   - Click the input field at the bottom of the "Todo" column
   - Enter task details and press Enter or click Add

2. **Editing a Task**:
   - Click on any task to open the detail modal
   - Modify task details, add/remove images
   - Save changes

3. **Moving Tasks**:
   - Drag and drop tasks between columns
   - Use the status dropdown in the task modal

4. **Managing Images**:
   - Click the image upload area in the task modal
   - Select multiple images
   - Click on images to view in full size
   - Delete images using the remove button

### Using Analytics

1. **Viewing Metrics**:
   - Click the analytics icon in the bottom-left corner
   - View real-time statistics and distributions
   - Track task completion rates and timing

2. **Activity Timeline**:
   - See recent task updates
   - Track task movements and status changes
   - Monitor completion patterns

### Customization

1. **Theme Settings**:
   - Click the settings icon
   - Choose between light/dark/system theme
   - Select background themes
   - Configure background music

2. **Custom Columns**:
   - Add new columns in settings
   - Name and organize custom columns
   - Drag to reorder columns

## 🔧 Technical Details

### Tech Stack
- React
- TypeScript
- Tailwind CSS
- react-beautiful-dnd
- LocalStorage for data persistence

### Project Structure
```
src/
├── components/          # React components
├── contexts/           # Context providers
├── hooks/              # Custom React hooks
├── services/           # Service modules
├── types/              # TypeScript types
├── utils/             # Utility functions
└── styles/            # CSS modules and styles
```

### Key Components
- `Board.tsx`: Main board component with drag-and-drop
- `TodoModal.tsx`: Task detail modal
- `Analytics.tsx`: Analytics dashboard
- `Settings.tsx`: Application settings
- `ErrorBoundary.tsx`: Error handling component

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- react-beautiful-dnd for the drag-and-drop functionality
- All contributors and users of this application
