import { createContext, useContext, ReactNode } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Project, Task, Resource, Milestone, ViewMode, GanttSettings } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { addDays } from 'date-fns'
import { createSampleTasks, createSampleResources, createSampleMilestones } from '../utils/sampleData'

// Helper to convert date strings back to Date objects when loading from storage
const reviveDates = (project: Project): Project => ({
  ...project,
  startDate: new Date(project.startDate),
  endDate: new Date(project.endDate),
  createdAt: new Date(project.createdAt),
  updatedAt: new Date(project.updatedAt),
  tasks: project.tasks.map(task => ({
    ...task,
    startDate: new Date(task.startDate),
    endDate: new Date(task.endDate)
  })),
  milestones: project.milestones.map(milestone => ({
    ...milestone,
    date: new Date(milestone.date)
  }))
})

interface ProjectState {
  // Current project state
  currentProject: Project | null
  projects: Project[]
  selectedTaskIds: string[]
  viewMode: ViewMode
  ganttSettings: GanttSettings
  
  // Actions
  createProject: (name: string, description?: string, startDate?: Date, endDate?: Date) => void
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
    persist(
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
        createProject: (name: string, description?: string, startDate?: Date, endDate?: Date) => {        
          const projectStartDate = startDate || new Date()
          const projectEndDate = endDate || addDays(projectStartDate, 30)
          
          const newProject: Project = {
            id: uuidv4(),
            name,
            description,
            startDate: projectStartDate,
            endDate: projectEndDate,
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
          set((state) => {
            const remainingProjects = state.projects.filter(p => p.id !== projectId)
            const isCurrentProjectDeleted = state.currentProject?.id === projectId
            
            return {
              projects: remainingProjects,
              currentProject: isCurrentProjectDeleted 
                ? (remainingProjects.length > 0 ? remainingProjects[0] : null)
                : state.currentProject
            }
          })
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
      {
        name: 'msproject-storage',
        // Custom storage with date revival
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name)
            if (!str) return null
            
            try {
              const parsed = JSON.parse(str)
              // Revive dates in projects
              if (parsed.state?.projects) {
                parsed.state.projects = parsed.state.projects.map(reviveDates)
              }
              if (parsed.state?.currentProject) {
                parsed.state.currentProject = reviveDates(parsed.state.currentProject)
              }
              return parsed
            } catch {
              return null
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value))
          },
          removeItem: (name) => {
            localStorage.removeItem(name)
          }
        },
        // Only persist essential data, not transient UI state like selectedTaskIds
        partialize: (state) => ({
          projects: state.projects,
          currentProject: state.currentProject,
          ganttSettings: state.ganttSettings
        } as ProjectState)
      }
    ),
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