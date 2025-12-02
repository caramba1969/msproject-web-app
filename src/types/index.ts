export interface Task {
  id: string
  name: string
  startDate: Date
  endDate: Date
  duration: number // in days
  progress: number // 0-100
  assignee?: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold'
  description?: string
  dependencies: string[] // task IDs that this task depends on
  parentId?: string // for subtasks
  children?: string[] // subtask IDs
  color: string
  milestoneId?: string
}

export interface Resource {
  id: string
  name: string
  email?: string
  role: string
  availability: number // 0-100 percentage
  hourlyRate?: number
  avatar?: string
}

export interface Milestone {
  id: string
  name: string
  date: Date
  description?: string
  completed: boolean
  tasks: string[] // associated task IDs
}

export interface Project {
  id: string
  name: string
  description?: string
  startDate: Date
  endDate: Date
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled'
  owner: string
  tasks: Task[]
  resources: Resource[]
  milestones: Milestone[]
  createdAt: Date
  updatedAt: Date
}

export interface ViewMode {
  type: 'gantt' | 'kanban' | 'calendar' | 'timeline' | 'resource'
  timeScale: 'day' | 'week' | 'month' | 'quarter'
  showCriticalPath: boolean
  showDependencies: boolean
}

export interface GanttSettings {
  columnWidth: number
  rowHeight: number
  showWeekends: boolean
  showToday: boolean
  gridLines: boolean
  taskLabels: boolean
}