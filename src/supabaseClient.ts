import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ymxbxnvwdjwudixairwo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlteGJ4bnZ3ZGp3dWRpeGFpcndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjYwMzQsImV4cCI6MjA2MDg0MjAzNH0.JnZaujUofCbqKuqg_EHSklmNBvAKwJ9OzN4w6EaJXos'
);
