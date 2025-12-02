import { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Project, Task, Resource, Milestone, ViewMode, GanttSettings } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { addDays } from 'date-fns'
import { createSampleTasks, createSampleResources, createSampleMilestones } from '../utils/sampleData'

interface ProjectState {
  // Current project state
  currentProject: Project | null
  projects: Project[]
  selectedTaskIds: string[]
  viewMode: ViewMode
  ganttSettings: GanttSettings
  
  // Actions
  createProject: (name: string, description?: string) => void
  loadProject: (projectId: string) => void
  updateProject: (updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
  
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  selectTask: (taskId: string, multiSelect?: boolean) => void
  clearSelection: () => void
  
  // Resource actions
  addResource: (resource: Omit<Resource, 'id'>) => void
  updateResource: (resourceId: string, updates: Partial<Resource>) => void
  deleteResource: (resourceId: string) => void
  
  // Milestone actions
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => void
  deleteMilestone: (milestoneId: string) => void
  
  // View actions
  setViewMode: (viewMode: ViewMode) => void
  updateGanttSettings: (settings: Partial<GanttSettings>) => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentProject: null,
      projects: [],
      selectedTaskIds: [],
      viewMode: {
        type: 'gantt',
        timeScale: 'week',
        showCriticalPath: false,
        showDependencies: true
      },
      ganttSettings: {
        columnWidth: 80,
        rowHeight: 40,
        showWeekends: false,
        showToday: true,
        gridLines: true,
        taskLabels: true
      },

      // Project actions
      createProject: (name: string, description?: string) => {        
        const newProject: Project = {
          id: uuidv4(),
          name,
          description,
          startDate: new Date(),
          endDate: addDays(new Date(), 30),
          status: 'Planning',
          owner: 'Current User',
          tasks: createSampleTasks(),
          resources: createSampleResources(),
          milestones: createSampleMilestones(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject
        }))
      },

      loadProject: (projectId: string) => {
        const project = get().projects.find(p => p.id === projectId)
        if (project) {
          set({ currentProject: project })
        }
      },

      updateProject: (updates: Partial<Project>) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedProject = { ...state.currentProject, ...updates, updatedAt: new Date() }
          const updatedProjects = state.projects.map(p => 
            p.id === state.currentProject!.id ? updatedProject : p
          )
          
          return {
            currentProject: updatedProject,
            projects: updatedProjects
          }
        })
      },

      deleteProject: (projectId: string) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId),
          currentProject: state.currentProject?.id === projectId ? null : state.currentProject
        }))
      },

      // Task actions
      addTask: (task: Omit<Task, 'id'>) => {
        const newTask: Task = {
          ...task,
          id: uuidv4()
        }
        
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedProject = {
            ...state.currentProject,
            tasks: [...state.currentProject.tasks, newTask],
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedTasks = state.currentProject.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
          
          const updatedProject = {
            ...state.currentProject,
            tasks: updatedTasks,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      deleteTask: (taskId: string) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedTasks = state.currentProject.tasks.filter(task => task.id !== taskId)
          const updatedProject = {
            ...state.currentProject,
            tasks: updatedTasks,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            ),
            selectedTaskIds: state.selectedTaskIds.filter(id => id !== taskId)
          }
        })
      },

      selectTask: (taskId: string, multiSelect = false) => {
        set((state) => {
          if (multiSelect) {
            const isSelected = state.selectedTaskIds.includes(taskId)
            return {
              selectedTaskIds: isSelected 
                ? state.selectedTaskIds.filter(id => id !== taskId)
                : [...state.selectedTaskIds, taskId]
            }
          } else {
            return { selectedTaskIds: [taskId] }
          }
        })
      },

      clearSelection: () => {
        set({ selectedTaskIds: [] })
      },

      // Resource actions
      addResource: (resource: Omit<Resource, 'id'>) => {
        const newResource: Resource = { ...resource, id: uuidv4() }
        
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedProject = {
            ...state.currentProject,
            resources: [...state.currentProject.resources, newResource],
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      updateResource: (resourceId: string, updates: Partial<Resource>) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedResources = state.currentProject.resources.map(resource =>
            resource.id === resourceId ? { ...resource, ...updates } : resource
          )
          
          const updatedProject = {
            ...state.currentProject,
            resources: updatedResources,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      deleteResource: (resourceId: string) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedResources = state.currentProject.resources.filter(
            resource => resource.id !== resourceId
          )
          
          const updatedProject = {
            ...state.currentProject,
            resources: updatedResources,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      // Milestone actions
      addMilestone: (milestone: Omit<Milestone, 'id'>) => {
        const newMilestone: Milestone = { ...milestone, id: uuidv4() }
        
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedProject = {
            ...state.currentProject,
            milestones: [...state.currentProject.milestones, newMilestone],
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedMilestones = state.currentProject.milestones.map(milestone =>
            milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
          )
          
          const updatedProject = {
            ...state.currentProject,
            milestones: updatedMilestones,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      deleteMilestone: (milestoneId: string) => {
        set((state) => {
          if (!state.currentProject) return state
          
          const updatedMilestones = state.currentProject.milestones.filter(
            milestone => milestone.id !== milestoneId
          )
          
          const updatedProject = {
            ...state.currentProject,
            milestones: updatedMilestones,
            updatedAt: new Date()
          }
          
          return {
            currentProject: updatedProject,
            projects: state.projects.map(p => 
              p.id === state.currentProject!.id ? updatedProject : p
            )
          }
        })
      },

      // View actions
      setViewMode: (viewMode: ViewMode) => {
        set({ viewMode })
      },

      updateGanttSettings: (settings: Partial<GanttSettings>) => {
        set((state) => ({
          ganttSettings: { ...state.ganttSettings, ...settings }
        }))
      }
    }),
    { name: 'project-store' }
  )
)

// Context provider for the store
const ProjectContext = createContext<ReturnType<typeof useProjectStore> | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  return (
    <ProjectContext.Provider value={useProjectStore()}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}