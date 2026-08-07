import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function createStubClient() {
  const createChainable = (table: string) => ({
    select: () => createChainable(table),
    eq: () => createChainable(table),
    order: () => createChainable(table),
    limit: () => createChainable(table),
    single: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
    insert: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
    update: async () => ({ data: null, error: { message: 'Supabase is not configured.' } }),
  })

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: { message: 'Supabase is not configured.' } }),
    },
    from: (table: string) => createChainable(table),
  }
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createStubClient()

export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || !supabaseUrl) return createStubClient()

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}