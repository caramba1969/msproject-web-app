import React from 'react'
import { useProjectStore } from '../store/ProjectStore'

export default function KanbanBoard() {
  const { currentProject } = useProjectStore()
  const tasks = currentProject?.tasks || []

  const columns = [
    { id: 'Not Started', title: 'Not Started', color: 'bg-gray-100' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'Completed', title: 'Completed', color: 'bg-green-100' },
    { id: 'On Hold', title: 'On Hold', color: 'bg-yellow-100' }
  ]

  return (
    <div className="h-full p-4">
      <div className="grid grid-cols-4 gap-4 h-full">
        {columns.map(column => (
          <div key={column.id} className={`rounded-lg p-4 ${column.color}`}>
            <h3 className="font-semibold mb-4">{column.title}</h3>
            <div className="space-y-2">
              {tasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div key={task.id} className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium text-sm">{task.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{task.assignee}</p>
                    <div className="mt-2">
                      <div className={`inline-block px-2 py-1 text-xs rounded ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}