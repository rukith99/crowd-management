import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.CROWD_APP_SUPABASE_URL, 
    process.env.CROWD_APP_SUPABASE_ANON_KEY
);