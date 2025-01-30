import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'

const supabaseUrl = 'https://lwxklqndsxwisifwlulo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eGtscW5kc3h3aXNpZndsdWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1ODYyMjEsImV4cCI6MjA1MzE2MjIyMX0.evHmlua3BQMUIRk0qlzaQsbOVdKQcwXF1jaLg7tDR6o'

export const createClient = () => {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}