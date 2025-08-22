import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xqtdrpvfgqvyfepimaon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxdGRycHZmZ3F2eWZlcGltYW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MjIzNzMsImV4cCI6MjA3MTM5ODM3M30.QjsKbSz3-35Awd1xegiU6sMVQV7Eest2IowoU12r9Ms';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);