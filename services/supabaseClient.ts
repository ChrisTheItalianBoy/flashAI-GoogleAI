
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely in Vite
const getEnv = (key: string) => {
  // @ts-ignore
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://mrljkevytzaovlcdsjsi.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybGprZXZ5dHphb3ZsY2RzanNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODA0NzYsImV4cCI6MjA4MTA1NjQ3Nn0.WBgquhLxV893YbPUZ7Zhu7UOfsoZqLTEGQa79Mj4f24';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected.");
