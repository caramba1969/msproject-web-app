import { useEffect, useRef } from 'react'
import { useProjectStore } from '../store/ProjectStore'
import { format, addDays, differenceInDays } from 'date-fns'

export default function GanttChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { currentProject, ganttSettings, selectedTaskIds, selectTask } = useProjectStore()

  const tasks = currentProject?.tasks || []

  // Sample tasks if none exist
  useEffect(() => {
    if (currentProject && tasks.length === 0) {
      // Add sample tasks here if needed
    }
  }, [currentProject, tasks])

  const renderTimeline = () => {
    if (!svgRef.current || tasks.length === 0) return

    const svg = svgRef.current
    const containerWidth = svg.clientWidth || 800

    // Clear previous content
    svg.innerHTML = ''

    // Timeline configuration
    const timelineStart = new Date()
    const timelineEnd = addDays(timelineStart, 90) // 3 months
    const totalDays = differenceInDays(timelineEnd, timelineStart)
    
    const leftPanelWidth = 200
    const chartWidth = containerWidth - leftPanelWidth
    const dayWidth = chartWidth / totalDays
    const taskHeight = ganttSettings.rowHeight
    const headerHeight = 60

    // Create timeline header
    const headerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    headerGroup.setAttribute('class', 'timeline-header')

    // Month headers
    let currentDate = new Date(timelineStart)
    let x = leftPanelWidth
    
    while (currentDate < timelineEnd) {
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      const monthWidth = Math.min(
        differenceInDays(monthEnd, currentDate) * dayWidth,
        differenceInDays(timelineEnd, currentDate) * dayWidth
      )

      // Month background
      const monthRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      monthRect.setAttribute('x', x.toString())
      monthRect.setAttribute('y', '0')
      monthRect.setAttribute('width', monthWidth.toString())
      monthRect.setAttribute('height', (headerHeight / 2).toString())
      monthRect.setAttribute('fill', '#f8fafc')
      monthRect.setAttribute('stroke', '#e2e8f0')
      headerGroup.appendChild(monthRect)

      // Month label
      const monthText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      monthText.setAttribute('x', (x + monthWidth / 2).toString())
      monthText.setAttribute('y', '20')
      monthText.setAttribute('text-anchor', 'middle')
      monthText.setAttribute('class', 'text-sm font-medium fill-gray-700')
      monthText.textContent = format(currentDate, 'MMM yyyy')
      headerGroup.appendChild(monthText)

      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
      x += monthWidth
    }

    // Week/Day grid
    for (let day = 0; day < totalDays; day++) {
      const dayDate = addDays(timelineStart, day)
      const dayX = leftPanelWidth + (day * dayWidth)
      
      // Vertical grid line
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      gridLine.setAttribute('x1', dayX.toString())
      gridLine.setAttribute('y1', headerHeight.toString())
      gridLine.setAttribute('x2', dayX.toString())
      gridLine.setAttribute('y2', (headerHeight + tasks.length * taskHeight).toString())
      gridLine.setAttribute('stroke', '#f1f5f9')
      gridLine.setAttribute('stroke-width', '1')
      headerGroup.appendChild(gridLine)

      // Week label
      if (dayDate.getDay() === 1) { // Monday
        const weekText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        weekText.setAttribute('x', (dayX + dayWidth * 3.5).toString())
        weekText.setAttribute('y', '45')
        weekText.setAttribute('text-anchor', 'middle')
        weekText.setAttribute('class', 'text-xs fill-gray-500')
        weekText.textContent = format(dayDate, 'MMM d')
        headerGroup.appendChild(weekText)
      }
    }

    svg.appendChild(headerGroup)

    // Task bars
    tasks.forEach((task, index) => {
      const taskGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      taskGroup.setAttribute('class', 'task-group')
      
      const taskY = headerHeight + (index * taskHeight)
      const isSelected = selectedTaskIds.includes(task.id)

      // Task label background
      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      labelBg.setAttribute('x', '0')
      labelBg.setAttribute('y', taskY.toString())
      labelBg.setAttribute('width', leftPanelWidth.toString())
      labelBg.setAttribute('height', taskHeight.toString())
      labelBg.setAttribute('fill', isSelected ? '#dbeafe' : '#ffffff')
      labelBg.setAttribute('stroke', '#e5e7eb')
      taskGroup.appendChild(labelBg)

      // Task label
      const taskLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      taskLabel.setAttribute('x', '10')
      taskLabel.setAttribute('y', (taskY + taskHeight / 2 + 4).toString())
      taskLabel.setAttribute('class', 'text-sm fill-gray-900')
      taskLabel.textContent = task.name
      taskGroup.appendChild(taskLabel)

      // Calculate task bar position
      const taskStart = differenceInDays(task.startDate, timelineStart)
      const taskDuration = differenceInDays(task.endDate, task.startDate)
      const barX = leftPanelWidth + (taskStart * dayWidth)
      const barWidth = Math.max(taskDuration * dayWidth, 20) // Minimum width

      if (taskStart < totalDays && taskStart + taskDuration > 0) {
        // Task bar background
        const taskBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        taskBar.setAttribute('x', barX.toString())
        taskBar.setAttribute('y', (taskY + 8).toString())
        taskBar.setAttribute('width', barWidth.toString())
        taskBar.setAttribute('height', (taskHeight - 16).toString())
        taskBar.setAttribute('rx', '4')
        taskBar.setAttribute('fill', task.color || '#3b82f6')
        taskBar.setAttribute('opacity', isSelected ? '0.8' : '0.7')
        taskBar.setAttribute('class', 'cursor-pointer hover:opacity-90')
        taskBar.addEventListener('click', () => selectTask(task.id))
        taskGroup.appendChild(taskBar)

        // Progress bar
        if (task.progress > 0) {
          const progressBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
          progressBar.setAttribute('x', barX.toString())
          progressBar.setAttribute('y', (taskY + 8).toString())
          progressBar.setAttribute('width', (barWidth * task.progress / 100).toString())
          progressBar.setAttribute('height', (taskHeight - 16).toString())
          progressBar.setAttribute('rx', '4')
          progressBar.setAttribute('fill', task.color || '#3b82f6')
          progressBar.setAttribute('opacity', '1')
          taskGroup.appendChild(progressBar)
        }

        // Task info on hover
        const infoText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        infoText.setAttribute('x', (barX + 5).toString())
        infoText.setAttribute('y', (taskY + taskHeight / 2 + 2).toString())
        infoText.setAttribute('class', 'text-xs fill-white')
        infoText.textContent = `${Math.round(task.progress)}%`
        if (barWidth > 30) {
          taskGroup.appendChild(infoText)
        }
      }

      svg.appendChild(taskGroup)
    })

    // Today line
    const today = new Date()
    const todayDays = differenceInDays(today, timelineStart)
    if (todayDays >= 0 && todayDays <= totalDays && ganttSettings.showToday) {
      const todayX = leftPanelWidth + (todayDays * dayWidth)
      const todayLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      todayLine.setAttribute('x1', todayX.toString())
      todayLine.setAttribute('y1', headerHeight.toString())
      todayLine.setAttribute('x2', todayX.toString())
      todayLine.setAttribute('y2', (headerHeight + tasks.length * taskHeight).toString())
      todayLine.setAttribute('stroke', '#ef4444')
      todayLine.setAttribute('stroke-width', '2')
      todayLine.setAttribute('opacity', '0.7')
      svg.appendChild(todayLine)
    }
  }

  useEffect(() => {
    renderTimeline()
  }, [tasks, ganttSettings, selectedTaskIds])

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No project selected
      </div>
    )
  }

  return (
    <div className="h-full bg-white">
      <div className="h-full overflow-auto">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ minHeight: '400px', height: `${60 + tasks.length * ganttSettings.rowHeight}px` }}
        />
      </div>
    </div>
  )
}