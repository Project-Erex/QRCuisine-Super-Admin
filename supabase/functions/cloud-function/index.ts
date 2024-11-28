// supabase/functions/cloudinaryUsage/index.ts
// import { serve } from 'https://deno.land/x/supabase@0.1.1/mod.ts';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import axios from "https://cdn.skypack.dev/axios";
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {


  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }


  const url = new URL(req.url);
  const cloudName = url.searchParams.get("cloudName");
  const apiKey = url.searchParams.get("apiKey");
  const apiSecret = url.searchParams.get("apiSecret");

  const auth = `${apiKey}:${apiSecret}`;

  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
      {
        headers: {
          Authorization: `Basic ${btoa(auth)}`, 
        },
      },
    );

    return new Response(JSON.stringify(response.data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    return new Response("Error fetching data", {status: 500});
  }
});
