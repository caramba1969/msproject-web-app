import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XIcon } from 'lucide-react'
import { format, addDays } from 'date-fns'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (project: {
    name: string
    description: string
    startDate: Date
    endDate: Date
  }) => void
  existingProjectNames?: string[]
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  existingProjectNames = []
}: CreateProjectModalProps) {
  const today = new Date()
  const defaultEndDate = addDays(today, 30)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(format(today, 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(defaultEndDate, 'yyyy-MM-dd'))
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
    } else if (name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters'
    } else if (existingProjectNames.some(n => n.toLowerCase() === name.trim().toLowerCase())) {
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

    if (!validateForm()) {
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    })

    // Reset form
    setName('')
    setDescription('')
    setStartDate(format(today, 'yyyy-MM-dd'))
    setEndDate(format(defaultEndDate, 'yyyy-MM-dd'))
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    // Reset form on close
    setName('')
    setDescription('')
    setStartDate(format(today, 'yyyy-MM-dd'))
    setEndDate(format(defaultEndDate, 'yyyy-MM-dd'))
    setErrors({})
    onClose()
  }

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
              Create New Project
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Project Name */}
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="project-name"
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
              <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project description (optional)"
                maxLength={500}
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id="start-date"
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
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                id="end-date"
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
            <div className="flex justify-end space-x-3 pt-4">
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
                Create Project
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
