import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zptdwmsbyyrccmcfyttr.supabase.co";
const supabaseAnonKey = "sb_publishable_0tnO5U4wlRKbT1z_RX3M0g_DJzyZ8GC";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);