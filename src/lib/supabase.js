import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zptdwmsbyrccmcfyttr.supabase.co";
const supabaseAnonKey = "sb_publishable_AQUI_TU_KEY_REAL";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);