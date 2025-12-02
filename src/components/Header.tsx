import { useProjectStore } from '../store/ProjectStore'
import { 
  FolderIcon, 
  CalendarIcon, 
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const currentProject = useProjectStore((state) => state.currentProject)
  const createProject = useProjectStore((state) => state.createProject)

  const handleNewProject = () => {
    const projectName = prompt('Enter project name:')
    if (projectName) {
      createProject(projectName, 'New project description')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            MS Project Web
          </h1>
          {currentProject && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FolderIcon className="h-4 w-4" />
              <span>{currentProject.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleNewProject}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Project
            </button>
          </div>

          {/* View Options */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <CalendarIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <ChartBarIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <UserGroupIcon className="h-5 w-5" />
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <BellIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
              <CogIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}