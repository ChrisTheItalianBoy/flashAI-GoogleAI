
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user or environment variables
// Using process.env allow overriding these in deployment (e.g. Vercel, Netlify) without changing code.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mrljkevytzaovlcdsjsi.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybGprZXZ5dHphb3ZsY2RzanNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODA0NzYsImV4cCI6MjA4MTA1NjQ3Nn0.WBgquhLxV893YbPUZ7Zhu7UOfsoZqLTEGQa79Mj4f24';

// Initialize the Supabase client
// This enables the app to call Edge Functions (like send-email and generate-flashcards)
export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected.");
