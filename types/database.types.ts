export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          owner_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string
          status: 'todo' | 'in_progress' | 'done'
          due_date: string | null
          project_id: string
          urgency: 'high' | 'medium' | 'low' | 'none' | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          status?: 'todo' | 'in_progress' | 'done'
          due_date?: string | null
          project_id: string
          urgency?: 'high' | 'medium' | 'low' | 'none' | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          status?: 'todo' | 'in_progress' | 'done'
          due_date?: string | null
          project_id?: string
          urgency?: 'high' | 'medium' | 'low' | 'none' | null
        }
      }
    }
  }
} 