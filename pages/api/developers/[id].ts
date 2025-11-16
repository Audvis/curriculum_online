import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const developerId = parseInt(id as string)

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('developers')
      .select('*')
      .eq('id', developerId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Developer not found' })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { name, email, position, department, avatar_url } = req.body

    const { data, error } = await supabase
      .from('developers')
      .update({
        name,
        email,
        position,
        department,
        avatar_url
      })
      .eq('id', developerId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('developers')
      .delete()
      .eq('id', developerId)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ message: 'Developer deleted successfully' })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
