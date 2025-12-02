import { useProjectStore } from '../store/ProjectStore'
import {
  BarChart3Icon,
  CalendarIcon,
  KanbanSquareIcon,
  UsersIcon,
  SettingsIcon,
  FolderIcon,
  PlusIcon
} from 'lucide-react'

export default function Sidebar() {
  const viewMode = useProjectStore((state) => state.viewMode)
  const setViewMode = useProjectStore((state) => state.setViewMode)
  const currentProject = useProjectStore((state) => state.currentProject)

  const navigationItems = [
    { 
      name: 'Gantt Chart', 
      icon: BarChart3Icon, 
      type: 'gantt' as const,
      description: 'Timeline view with dependencies'
    },
    { 
      name: 'Calendar', 
      icon: CalendarIcon, 
      type: 'calendar' as const,
      description: 'Calendar view of tasks'
    },
    { 
      name: 'Kanban', 
      icon: KanbanSquareIcon, 
      type: 'kanban' as const,
      description: 'Board view by status'
    },
    { 
      name: 'Resources', 
      icon: UsersIcon, 
      type: 'resource' as const,
      description: 'Team and resource management'
    },
  ]

  const handleViewChange = (type: typeof viewMode.type) => {
    setViewMode({
      ...viewMode,
      type
    })
  }

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Project Info */}
      <div className="p-4 border-b border-gray-700">
        {currentProject ? (
          <div>
            <h2 className="text-lg font-semibold truncate">{currentProject.name}</h2>
            <p className="text-sm text-gray-400 mt-1">
              {currentProject.tasks.length} tasks • {currentProject.resources.length} resources
            </p>
          </div>
        ) : (
          <div className="text-center">
            <FolderIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-400">No project selected</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Views
          </h3>
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = viewMode.type === item.type
            
            return (
              <button
                key={item.name}
                onClick={() => handleViewChange(item.type)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={item.description}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Quick Actions
          </h3>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white">
            <PlusIcon className="mr-3 h-5 w-5" />
            Add Task
          </button>
          <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white">
            <UsersIcon className="mr-3 h-5 w-5" />
            Add Resource
          </button>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-800 hover:text-white">
          <SettingsIcon className="mr-3 h-5 w-5" />
          Settings
        </button>
      </div>
    </aside>
  )
}