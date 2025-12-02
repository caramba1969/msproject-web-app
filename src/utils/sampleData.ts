import { Task } from '../types'
import { addDays } from 'date-fns'

export const createSampleTasks = (): Task[] => {
  const today = new Date()
  
  return [
    {
      id: 'task-1',
      name: 'Project Planning & Requirements',
      startDate: today,
      endDate: addDays(today, 5),
      duration: 5,
      progress: 80,
      assignee: 'John Doe',
      priority: 'High',
      status: 'In Progress',
      description: 'Define project scope and gather requirements',
      dependencies: [],
      color: '#3b82f6'
    },
    {
      id: 'task-2',
      name: 'UI/UX Design',
      startDate: addDays(today, 3),
      endDate: addDays(today, 10),
      duration: 7,
      progress: 60,
      assignee: 'Jane Smith',
      priority: 'High',
      status: 'In Progress',
      description: 'Create wireframes and user interface designs',
      dependencies: ['task-1'],
      color: '#10b981'
    },
    {
      id: 'task-3',
      name: 'Frontend Development',
      startDate: addDays(today, 8),
      endDate: addDays(today, 20),
      duration: 12,
      progress: 30,
      assignee: 'Mike Johnson',
      priority: 'Medium',
      status: 'In Progress',
      description: 'Implement the user interface components',
      dependencies: ['task-2'],
      color: '#f59e0b'
    },
    {
      id: 'task-4',
      name: 'Backend Development',
      startDate: addDays(today, 10),
      endDate: addDays(today, 25),
      duration: 15,
      progress: 20,
      assignee: 'Sarah Wilson',
      priority: 'Medium',
      status: 'Not Started',
      description: 'Develop server-side functionality and APIs',
      dependencies: ['task-1'],
      color: '#8b5cf6'
    },
    {
      id: 'task-5',
      name: 'Testing & QA',
      startDate: addDays(today, 22),
      endDate: addDays(today, 30),
      duration: 8,
      progress: 0,
      assignee: 'Tom Brown',
      priority: 'High',
      status: 'Not Started',
      description: 'Comprehensive testing and quality assurance',
      dependencies: ['task-3', 'task-4'],
      color: '#ef4444'
    },
    {
      id: 'task-6',
      name: 'Deployment & Launch',
      startDate: addDays(today, 28),
      endDate: addDays(today, 35),
      duration: 7,
      progress: 0,
      assignee: 'Alex Davis',
      priority: 'Critical',
      status: 'Not Started',
      description: 'Deploy to production and launch the application',
      dependencies: ['task-5'],
      color: '#06b6d4'
    }
  ]
}

export const createSampleResources = () => {
  return [
    {
      id: 'resource-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Project Manager',
      availability: 100,
      hourlyRate: 85
    },
    {
      id: 'resource-2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'UI/UX Designer',
      availability: 80,
      hourlyRate: 75
    },
    {
      id: 'resource-3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Frontend Developer',
      availability: 100,
      hourlyRate: 80
    },
    {
      id: 'resource-4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Backend Developer',
      availability: 90,
      hourlyRate: 85
    },
    {
      id: 'resource-5',
      name: 'Tom Brown',
      email: 'tom.brown@company.com',
      role: 'QA Engineer',
      availability: 100,
      hourlyRate: 70
    },
    {
      id: 'resource-6',
      name: 'Alex Davis',
      email: 'alex.davis@company.com',
      role: 'DevOps Engineer',
      availability: 75,
      hourlyRate: 90
    }
  ]
}

export const createSampleMilestones = () => {
  const today = new Date()
  
  return [
    {
      id: 'milestone-1',
      name: 'Requirements Complete',
      date: addDays(today, 5),
      description: 'All project requirements have been gathered and approved',
      completed: false,
      tasks: ['task-1']
    },
    {
      id: 'milestone-2',
      name: 'Design Phase Complete',
      date: addDays(today, 10),
      description: 'UI/UX designs are finalized and approved',
      completed: false,
      tasks: ['task-2']
    },
    {
      id: 'milestone-3',
      name: 'Development Complete',
      date: addDays(today, 25),
      description: 'All development work is finished',
      completed: false,
      tasks: ['task-3', 'task-4']
    },
    {
      id: 'milestone-4',
      name: 'Project Launch',
      date: addDays(today, 35),
      description: 'Application is deployed and launched',
      completed: false,
      tasks: ['task-6']
    }
  ]
}

export const formatDuration = (days: number): string => {
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`
  
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7
  
  let result = `${weeks} week${weeks > 1 ? 's' : ''}`
  if (remainingDays > 0) {
    result += ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  }
  
  return result
}

export const calculateProjectProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0
  
  const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(totalProgress / tasks.length)
}

export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case 'Not Started':
      return 'text-gray-600'
    case 'In Progress':
      return 'text-blue-600'
    case 'Completed':
      return 'text-green-600'
    case 'On Hold':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Low':
      return '#10b981'
    case 'Medium':
      return '#f59e0b'
    case 'High':
      return '#ef4444'
    case 'Critical':
      return '#dc2626'
    default:
      return '#6b7280'
  }
}