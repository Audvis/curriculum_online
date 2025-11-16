import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, email, position, department, avatar_url } = req.body

    const { data, error } = await supabase
      .from('developers')
      .insert([
        {
          name,
          email,
          position,
          department,
          avatar_url: avatar_url || ''
        }
      ])
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
