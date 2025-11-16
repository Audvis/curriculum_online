import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { developer_id } = req.query

    let query = supabase
      .from('timesheets')
      .select(`
        *,
        developers (
          name
        )
      `)
      .order('date', { ascending: false })

    if (developer_id) {
      query = query.eq('developer_id', parseInt(developer_id as string))
    }

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Transform data to include developer_name
    const transformedData = data?.map(item => ({
      ...item,
      developer_name: (item.developers as { name: string })?.name || '',
      developers: undefined
    }))

    return res.status(200).json(transformedData)
  }

  if (req.method === 'POST') {
    const {
      developer_id,
      date,
      project_name,
      task_description,
      hours_worked,
      task_type,
      status = 'Completed',
      notes = ''
    } = req.body

    const { data: insertedData, error: insertError } = await supabase
      .from('timesheets')
      .insert([
        {
          developer_id,
          date,
          project_name,
          task_description,
          hours_worked: parseFloat(hours_worked),
          task_type,
          status,
          notes
        }
      ])
      .select(`
        *,
        developers (
          name
        )
      `)
      .single()

    if (insertError) {
      return res.status(400).json({ error: insertError.message })
    }

    const responseData = {
      ...insertedData,
      developer_name: (insertedData.developers as { name: string })?.name || '',
      developers: undefined
    }

    return res.status(201).json(responseData)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
