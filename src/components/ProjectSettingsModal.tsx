import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon, TrashIcon, AlertTriangleIcon } from 'lucide-react'
import { Project } from '../types'
import { format } from 'date-fns'

interface ProjectSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onUpdate: (updates: Partial<Project>) => void
  onDelete: (projectId: string) => void
  existingProjectNames?: string[]
}

export default function ProjectSettingsModal({
  isOpen,
  onClose,
  project,
  onUpdate,
  onDelete,
  existingProjectNames = []
}: ProjectSettingsModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<Project['status']>('Planning')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form when project changes
  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description || '')
      setStartDate(format(project.startDate, 'yyyy-MM-dd'))
      setEndDate(format(project.endDate, 'yyyy-MM-dd'))
      setStatus(project.status)
      setErrors({})
      setShowDeleteConfirm(false)
    }
  }, [project])

  const validateForm = (): boolean => {
    if (!project) return false

    const newErrors: { [key: string]: string } = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
    } else if (name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters'
    } else if (
      name.trim().toLowerCase() !== project.name.toLowerCase() &&
      existingProjectNames.some(n => n.toLowerCase() === name.trim().toLowerCase())
    ) {
      newErrors.name = 'A project with this name already exists'
    }

    // Date validation
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required'
    }

    if (startDate && endDate && end <= start) {
      newErrors.endDate = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !project) {
      return
    }

    onUpdate({
      name: name.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status
    })

    onClose()
  }

  const handleDelete = () => {
    if (project) {
      onDelete(project.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const handleClose = () => {
    setShowDeleteConfirm(false)
    setErrors({})
    onClose()
  }

  if (!project) return null

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Project Settings
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {showDeleteConfirm ? (
            // Delete confirmation
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">
                Delete Project
              </h3>
              <p className="text-sm text-center text-gray-500 mb-6">
                Are you sure you want to delete "{project.name}"? This action cannot be undone
                and all tasks, resources, and milestones will be permanently removed.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Project
                </button>
              </div>
            </div>
          ) : (
            // Edit form
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label htmlFor="settings-project-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="settings-project-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter project name"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="settings-project-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="settings-project-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project description (optional)"
                  maxLength={500}
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="project-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Project['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="settings-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="settings-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="settings-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="settings-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete Project
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
