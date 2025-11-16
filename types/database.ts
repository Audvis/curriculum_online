export interface Database {
  public: {
    Tables: {
      developers: {
        Row: {
          id: number
          name: string
          email: string
          position: string
          department: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          position: string
          department: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          position?: string
          department?: string
          avatar_url?: string | null
          created_at?: string
        }
      }
      timesheets: {
        Row: {
          id: number
          developer_id: number
          date: string
          project_name: string
          task_description: string
          hours_worked: number
          task_type: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: number
          developer_id: number
          date: string
          project_name: string
          task_description: string
          hours_worked: number
          task_type: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          developer_id?: number
          date?: string
          project_name?: string
          task_description?: string
          hours_worked?: number
          task_type?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}

export interface Developer {
  id: number
  name: string
  email: string
  position: string
  department: string
  avatar_url: string | null
  created_at: string
}

export interface Timesheet {
  id: number
  developer_id: number
  developer_name?: string
  date: string
  project_name: string
  task_description: string
  hours_worked: number
  task_type: string
  status: string
  notes: string | null
  created_at: string
}

export interface Statistics {
  total_developers: number
  total_hours: number
  total_entries: number
  hours_by_type: Record<string, number>
  hours_by_project: Record<string, number>
}
