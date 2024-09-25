import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://icyaglvxuziqfcxwtymo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeWFnbHZ4dXppcWZjeHd0eW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjcyNzc5NCwiZXhwIjoyMDQyMzAzNzk0fQ.ux-uQc1JXVlCsFMoYM6VScq4OM0Y96NtAJnOZGSQplA";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
