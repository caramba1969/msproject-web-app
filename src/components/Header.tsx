import { useState } from 'react'
import { useProjectStore } from '../store/ProjectStore'
import { 
  CalendarIcon, 
  UsersIcon,
  BarChart3Icon,
  PlusIcon,
  BellIcon,
  SettingsIcon
} from 'lucide-react'
import CreateProjectModal from './CreateProjectModal'
import ProjectSwitcher from './ProjectSwitcher'
import ProjectSettingsModal from './ProjectSettingsModal'

export default function Header() {
  const currentProject = useProjectStore((state) => state.currentProject)
  const projects = useProjectStore((state) => state.projects)
  const createProject = useProjectStore((state) => state.createProject)
  const loadProject = useProjectStore((state) => state.loadProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleCreateProject = (project: {
    name: string
    description: string
    startDate: Date
    endDate: Date
  }) => {
    createProject(project.name, project.description, project.startDate, project.endDate)
  }

  const existingProjectNames = projects.map(p => p.name)

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              MS Project Web
            </h1>
            
            {/* Project Switcher */}
            <ProjectSwitcher
              projects={projects}
              currentProject={currentProject}
              onProjectSelect={loadProject}
              onCreateNew={() => setIsCreateModalOpen(true)}
            />

            {currentProject && (
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                title="Project Settings"
              >
                <SettingsIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
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
                <BarChart3Icon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                <UsersIcon className="h-5 w-5" />
              </button>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                <BellIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        existingProjectNames={existingProjectNames}
      />

      {/* Project Settings Modal */}
      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        project={currentProject}
        onUpdate={updateProject}
        onDelete={deleteProject}
        existingProjectNames={existingProjectNames}
      />
    </>
  )
}