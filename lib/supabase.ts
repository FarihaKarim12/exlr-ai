import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const NOT_CONFIGURED_ERROR = { message: 'Supabase is not configured.' }

function createStubClient(): SupabaseClient {
  const createChainable = (table: string): any => ({
    select: () => createChainable(table),
    eq: () => createChainable(table),
    order: () => createChainable(table),
    limit: () => createChainable(table),
    single: async () => ({ data: null, error: NOT_CONFIGURED_ERROR }),
    maybeSingle: async () => ({ data: null, error: NOT_CONFIGURED_ERROR }),
    insert: async () => ({ data: null, error: NOT_CONFIGURED_ERROR }),
    update: async () => ({ data: null, error: NOT_CONFIGURED_ERROR }),
    delete: async () => ({ data: null, error: NOT_CONFIGURED_ERROR }),
  })

  const stub = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: NOT_CONFIGURED_ERROR }),
      getSession: async () => ({ data: { session: null }, error: NOT_CONFIGURED_ERROR }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: NOT_CONFIGURED_ERROR }),
      signUp: async () => ({ data: { user: null, session: null }, error: NOT_CONFIGURED_ERROR }),
      resetPasswordForEmail: async () => ({ data: {}, error: NOT_CONFIGURED_ERROR }),
      updateUser: async () => ({ data: { user: null }, error: NOT_CONFIGURED_ERROR }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: (table: string) => createChainable(table),
  }

  return stub as unknown as SupabaseClient
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : createStubClient()

export function getSupabaseAdmin(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || !supabaseUrl) return createStubClient()

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}