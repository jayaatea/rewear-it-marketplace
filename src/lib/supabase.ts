
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = "https://zygcxcsrsouqufinknnj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Z2N4Y3Nyc291cXVmaW5rbm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODk1NTQsImV4cCI6MjA2MjI2NTU1NH0.ec8Rukehg8NZ__br4hTYoEPorRckqqYW9BINkBhivNY";

// Helper to clean up auth state to prevent issues
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
