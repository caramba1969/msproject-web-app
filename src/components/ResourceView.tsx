import React from 'react'
import { useProjectStore } from '../store/ProjectStore'
import { UserIcon, PlusIcon } from 'lucide-react'

export default function ResourceView() {
  const { currentProject, addResource } = useProjectStore()
  const resources = currentProject?.resources || []
  const tasks = currentProject?.tasks || []

  const getResourceTasks = (resourceId: string) => {
    return tasks.filter(task => task.assignee === resourceId)
  }

  const handleAddResource = () => {
    const name = prompt('Enter resource name:')
    if (name) {
      addResource({
        name,
        role: 'Team Member',
        availability: 100
      })
    }
  }

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Resources</h2>
        <button 
          onClick={handleAddResource}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No resources added yet</p>
          <button 
            onClick={handleAddResource}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add First Resource
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {resources.map(resource => {
            const resourceTasks = getResourceTasks(resource.id)
            const workload = (resourceTasks.length / Math.max(tasks.length, 1)) * 100
            
            return (
              <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-gray-500">{resource.role}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medium">{resourceTasks.length} tasks</div>
                    <div className={`text-sm ${
                      workload > 80 ? 'text-red-600' :
                      workload > 60 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {Math.round(workload)}% workload
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Availability</span>
                    <span>{resource.availability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${resource.availability}%` }}
                    />
                  </div>
                </div>
                
                {resourceTasks.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Assigned Tasks</h4>
                    <div className="space-y-1">
                      {resourceTasks.slice(0, 3).map(task => (
                        <div key={task.id} className="text-sm p-2 bg-gray-50 rounded">
                          {task.name}
                        </div>
                      ))}
                      {resourceTasks.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{resourceTasks.length - 3} more tasks
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}