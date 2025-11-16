import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get total developers
    const { count: totalDevelopers, error: devError } = await supabase
      .from('developers')
      .select('*', { count: 'exact', head: true })

    if (devError) throw devError

    // Get all timesheets for calculations
    const { data: timesheets, error: tsError } = await supabase
      .from('timesheets')
      .select('hours_worked, task_type, project_name')

    if (tsError) throw tsError

    // Calculate statistics
    const totalHours = timesheets?.reduce((sum, ts) => sum + ts.hours_worked, 0) || 0
    const totalEntries = timesheets?.length || 0

    // Hours by task type
    const hoursByType: Record<string, number> = {}
    timesheets?.forEach(ts => {
      if (!hoursByType[ts.task_type]) {
        hoursByType[ts.task_type] = 0
      }
      hoursByType[ts.task_type] += ts.hours_worked
    })

    // Round hours by type
    Object.keys(hoursByType).forEach(key => {
      hoursByType[key] = Math.round(hoursByType[key] * 100) / 100
    })

    // Hours by project
    const hoursByProject: Record<string, number> = {}
    timesheets?.forEach(ts => {
      if (!hoursByProject[ts.project_name]) {
        hoursByProject[ts.project_name] = 0
      }
      hoursByProject[ts.project_name] += ts.hours_worked
    })

    // Round hours by project
    Object.keys(hoursByProject).forEach(key => {
      hoursByProject[key] = Math.round(hoursByProject[key] * 100) / 100
    })

    return res.status(200).json({
      total_developers: totalDevelopers || 0,
      total_hours: Math.round(totalHours * 100) / 100,
      total_entries: totalEntries,
      hours_by_type: hoursByType,
      hours_by_project: hoursByProject
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return res.status(500).json({ error: 'Failed to fetch statistics' })
  }
}
