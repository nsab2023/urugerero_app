import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://hyplhnxadlawzeriqmhn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5cGxobnhhZGxhd3plcmlxbWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjY5MTYsImV4cCI6MjA4NjIwMjkxNn0.w8Tg773u0BGQbGvt8qc_HyczQ8rdwN8ZoMLGjP9JJAg"
)