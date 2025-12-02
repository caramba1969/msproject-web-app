import { useEffect } from 'react'
import { useProjectStore } from '../store/ProjectStore'
import GanttChart from './GanttChart'
import ResourceView from './ResourceView'
import CalendarView from './CalendarView'
import KanbanBoard from './KanbanBoard'
import Toolbar from './Toolbar'

export default function ProjectDashboard() {
  const currentProject = useProjectStore((state) => state.currentProject)
  const viewMode = useProjectStore((state) => state.viewMode) 
  const createProject = useProjectStore((state) => state.createProject)

  // Create a sample project if none exists
  useEffect(() => {
    if (!currentProject) {
      createProject('Sample Project', 'A sample project to demonstrate features')
    }
  }, [currentProject, createProject])

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Welcome to MS Project Web
          </h2>
          <p className="text-gray-600 mb-6">
            Create your first project to get started with project management.
          </p>
          <button
            onClick={() => createProject('New Project', 'Project description')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Project
          </button>
        </div>
      </div>
    )
  }

  const renderView = () => {
    switch (viewMode.type) {
      case 'gantt':
        return <GanttChart />
      case 'kanban':
        return <KanbanBoard />
      case 'calendar':
        return <CalendarView />
      case 'resource':
        return <ResourceView />
      case 'timeline':
        return <GanttChart />
      default:
        return <GanttChart />
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  )
}