import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const timesheetId = parseInt(id as string)

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('timesheets')
      .select(`
        *,
        developers (
          name
        )
      `)
      .eq('id', timesheetId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Timesheet not found' })
    }

    const responseData = {
      ...data,
      developer_name: (data.developers as { name: string })?.name || '',
      developers: undefined
    }

    return res.status(200).json(responseData)
  }

  if (req.method === 'PUT') {
    const {
      developer_id,
      date,
      project_name,
      task_description,
      hours_worked,
      task_type,
      status,
      notes
    } = req.body

    const updateData: Record<string, unknown> = {}
    if (developer_id !== undefined) updateData.developer_id = developer_id
    if (date !== undefined) updateData.date = date
    if (project_name !== undefined) updateData.project_name = project_name
    if (task_description !== undefined) updateData.task_description = task_description
    if (hours_worked !== undefined) updateData.hours_worked = parseFloat(hours_worked)
    if (task_type !== undefined) updateData.task_type = task_type
    if (status !== undefined) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabase
      .from('timesheets')
      .update(updateData)
      .eq('id', timesheetId)
      .select(`
        *,
        developers (
          name
        )
      `)
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    const responseData = {
      ...data,
      developer_name: (data.developers as { name: string })?.name || '',
      developers: undefined
    }

    return res.status(200).json(responseData)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('timesheets')
      .delete()
      .eq('id', timesheetId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ message: 'Timesheet entry deleted successfully' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
