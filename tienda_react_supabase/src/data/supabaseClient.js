import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ddedhbgjhloxaxgddyto.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWRoYmdqaGxveGF4Z2RkeXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDU2NzQsImV4cCI6MjA3ODg4MTY3NH0.rEKwbaVajti0kDHlu7UrGGBdZFBtmahQSMFo1-dEZ20";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
