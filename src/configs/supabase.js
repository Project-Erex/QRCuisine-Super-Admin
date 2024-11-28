import {createClient} from "@supabase/supabase-js";

// Define the Supabase credentials for different versions
const credentials = {
  USA: {
    USA: "USA",
    supabaseUrl: "https://nvvsoihxmczidolcqgru.supabase.co",
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dnNvaWh4bWN6aWRvbGNxZ3J1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTY2NTQ3NywiZXhwIjoyMDQ1MjQxNDc3fQ.hWyU7-2QyPqTZ6f--GmqFiJw7kfc-2w25NVg7JnfXoE",
  },
  India: {
    India: "India",
    supabaseUrl: "https://icyaglvxuziqfcxwtymo.supabase.co",
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeWFnbHZ4dXppcWZjeHd0eW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjcyNzc5NCwiZXhwIjoyMDQyMzAzNzk0fQ.ux-uQc1JXVlCsFMoYM6VScq4OM0Y96NtAJnOZGSQplA",
  },
};

const selectedVersion = localStorage.getItem("selectedVersion");

const {supabaseUrl, supabaseKey} = credentials[selectedVersion];

console.log("object", credentials[selectedVersion]);

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
