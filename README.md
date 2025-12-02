# MS Project-like Web Application

A modern, state-of-the-art web application similar to Microsoft Project, built with cutting-edge web technologies for efficient project management and planning.

## 🚀 Features

### Core Project Management
- **Gantt Chart Visualization** - Interactive timeline view with drag-and-drop functionality
- **Task Management** - Create, edit, and organize tasks with dependencies
- **Resource Allocation** - Manage team members and track workload
- **Timeline Views** - Multiple view modes including Calendar, Kanban, and Resource views
- **Real-time Updates** - Live synchronization across all views

### Advanced Capabilities
- **Drag & Drop Interface** - Intuitive task manipulation
- **Dependency Management** - Visual dependency tracking and critical path analysis
- **Progress Tracking** - Real-time progress monitoring and reporting
- **Multi-view Support** - Switch between Gantt, Calendar, Kanban, and Resource views
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Headless UI** - Unstyled, accessible UI components

### State Management & Data
- **Zustand** - Lightweight state management solution
- **D3.js** - Powerful data visualization library for charts
- **date-fns** - Modern date utility library
- **UUID** - Unique identifier generation

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing with Autoprefixer

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd msproject-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── GanttChart.tsx   # Main Gantt chart component
│   ├── KanbanBoard.tsx  # Kanban view component
│   ├── CalendarView.tsx # Calendar view component
│   ├── ResourceView.tsx # Resource management component
│   ├── Layout.tsx       # Main layout component
│   ├── Header.tsx       # Application header
│   ├── Sidebar.tsx      # Navigation sidebar
│   └── Toolbar.tsx      # Action toolbar
├── store/               # State management
│   └── ProjectStore.tsx # Zustand store for project data
├── types/               # TypeScript type definitions
│   └── index.ts         # Core type definitions
├── utils/               # Utility functions
│   └── sampleData.ts    # Sample data generation
└── App.tsx              # Main application component
```

## 🎯 Usage Guide

### Getting Started
1. **Create a New Project** - Click "New Project" in the header or use the welcome screen
2. **Add Tasks** - Use the "Add Task" button to create project tasks
3. **Assign Resources** - Navigate to the Resources view to add team members
4. **Set Dependencies** - Link related tasks in the Gantt chart view
5. **Track Progress** - Update task completion percentages as work progresses

### View Modes

#### Gantt Chart View
- **Timeline Visualization** - See all tasks on a timeline with start/end dates
- **Dependency Lines** - Visual connections between dependent tasks
- **Progress Bars** - Color-coded progress indicators
- **Critical Path** - Highlight the critical path through your project

#### Kanban Board View
- **Status Columns** - Tasks organized by status (Not Started, In Progress, Completed, On Hold)
- **Drag & Drop** - Move tasks between status columns
- **Priority Indicators** - Visual priority levels for each task

#### Calendar View
- **Monthly Overview** - See all tasks in a traditional calendar format
- **Task Distribution** - Understand workload distribution across dates
- **Deadline Tracking** - Easily identify upcoming deadlines

#### Resource View
- **Team Management** - Add and manage team members
- **Workload Analysis** - Visual workload distribution and availability
- **Assignment Tracking** - See which tasks are assigned to each resource

### Keyboard Shortcuts
- `Ctrl + N` - Create new project
- `Ctrl + T` - Add new task
- `Delete` - Delete selected task
- `Escape` - Clear selection

## 🔧 Configuration

### Gantt Chart Settings
- **Column Width** - Adjust timeline density
- **Row Height** - Change task bar height
- **Show Weekends** - Toggle weekend display
- **Grid Lines** - Enable/disable grid lines
- **Task Labels** - Show/hide task names on bars

### View Preferences
- **Time Scale** - Switch between Day, Week, Month, Quarter views
- **Show Dependencies** - Toggle dependency line visibility
- **Critical Path** - Highlight critical path analysis

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel** - Automatic deployments from Git
- **Netlify** - JAMstack deployment platform
- **AWS S3 + CloudFront** - Scalable cloud hosting
- **Docker** - Containerized deployment

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code analysis

### Development Workflow
1. **Feature Development** - Create feature branches from main
2. **Code Quality** - ESLint and TypeScript ensure code quality
3. **Testing** - Manual testing in development mode
4. **Build Verification** - Test production builds before deployment

## 🎨 Customization

### Theming
- **Tailwind CSS** - Modify `tailwind.config.js` for custom themes
- **Color Schemes** - Customize colors in the configuration
- **Component Styling** - All components use Tailwind classes

### Adding Features
- **New Views** - Extend the view system with additional project views
- **Custom Components** - Add specialized components for specific workflows
- **Enhanced Analytics** - Integrate additional reporting and analytics

## 📊 Performance

### Optimization Features
- **Virtual Scrolling** - Handle large datasets efficiently
- **Code Splitting** - Lazy load components for faster initial loads
- **Memoization** - React.memo and useMemo for optimal re-rendering
- **Tree Shaking** - Remove unused code from production builds

## 🔒 Data Management

### Local Storage
- **Project Data** - Projects stored in browser localStorage
- **User Preferences** - Settings preserved across sessions
- **Auto-save** - Automatic saving of changes

### Future Enhancements
- **Cloud Sync** - Synchronize data across devices
- **Collaboration** - Real-time collaborative editing
- **Export/Import** - Project data export in various formats

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **Component Documentation** - Inline comments and TypeScript definitions
- **API Reference** - Store methods and type definitions
- **Examples** - Sample implementations in the codebase

### Getting Help
- **Issues** - Report bugs and request features via GitHub issues
- **Discussions** - Community discussions and questions
- **Documentation** - Comprehensive guides and API references

---

**Built with ❤️ using modern web technologies**

*This application demonstrates best practices in modern React development with TypeScript, state management, and responsive design.*