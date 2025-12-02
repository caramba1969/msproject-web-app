import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FolderIcon, PlusIcon, CheckIcon } from 'lucide-react'
import { Project } from '../types'
import { format } from 'date-fns'

interface ProjectSwitcherProps {
  projects: Project[]
  currentProject: Project | null
  onProjectSelect: (projectId: string) => void
  onCreateNew: () => void
}

export default function ProjectSwitcher({
  projects,
  currentProject,
  onProjectSelect,
  onCreateNew
}: ProjectSwitcherProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <FolderIcon className="h-4 w-4 mr-2 text-gray-500" />
        <span className="max-w-32 truncate">
          {currentProject ? currentProject.name : 'Select Project'}
        </span>
        <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {/* Create New Project */}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onCreateNew}
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } w-full flex items-center px-4 py-2 text-sm text-blue-600 font-medium`}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create New Project
                </button>
              )}
            </Menu.Item>

            {projects.length > 0 && (
              <>
                <div className="border-t border-gray-100 my-1" />
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Your Projects
                </div>

                {projects.map((project) => (
                  <Menu.Item key={project.id}>
                    {({ active }) => (
                      <button
                        onClick={() => onProjectSelect(project.id)}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } w-full flex items-start px-4 py-2 text-sm`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            {currentProject?.id === project.id && (
                              <CheckIcon className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                            )}
                            <span className={`truncate ${
                              currentProject?.id === project.id 
                                ? 'font-medium text-blue-600' 
                                : 'text-gray-900'
                            }`}>
                              {project.name}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${
                              project.status === 'Active' ? 'bg-green-100 text-green-700' :
                              project.status === 'Planning' ? 'bg-blue-100 text-blue-700' :
                              project.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                              project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {project.status}
                            </span>
                            <span>{format(project.updatedAt, 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
