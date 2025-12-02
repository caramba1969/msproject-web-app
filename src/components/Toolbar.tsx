import React from 'react'
import { useProjectStore } from '../store/ProjectStore'
import {
  PlusIcon,
  FilterIcon,
  EyeIcon,
  DownloadIcon,
  ShareIcon
} from 'lucide-react'

export default function Toolbar() {
  const { viewMode, ganttSettings, updateGanttSettings } = useProjectStore()

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Add Task Button */}
          <button className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Task
          </button>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <select
              value={viewMode.timeScale}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="quarter">Quarter</option>
            </select>

            {viewMode.type === 'gantt' && (
              <>
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={viewMode.showDependencies}
                    className="mr-1"
                  />
                  Dependencies
                </label>
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={ganttSettings.showWeekends}
                    onChange={(e) => updateGanttSettings({ showWeekends: e.target.checked })}
                    className="mr-1"
                  />
                  Weekends
                </label>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <FilterIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <ShareIcon className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
            <DownloadIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}