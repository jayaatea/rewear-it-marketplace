
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://zygcxcsrsouqufinknnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Z2N4Y3Nyc291cXVmaW5rbm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODk1NTQsImV4cCI6MjA2MjI2NTU1NH0.ec8Rukehg8NZ__br4hTYoEPorRckqqYW9BINkBhivNY';

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: localStorage
    }
  }
);
