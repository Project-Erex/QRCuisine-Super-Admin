// supabase/functions/cloudinaryUsage/index.ts
// import { serve } from 'https://deno.land/x/supabase@0.1.1/mod.ts';
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import axios from "https://cdn.skypack.dev/axios";
import cors from "https://deno.land/x/edge_cors@VERSION/src/cors.ts";

Deno.serve(async (req) => {
  const cloudName = "drxwyotes";
  const apiKey = "749371497479183";
  const apiSecret = "yX9sQyShyf5usndtLYTx7J5TPAo";

  const auth = `${apiKey}:${apiSecret}`;

  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/usage`,
      {
        headers: {
          Authorization: `Basic ${btoa(auth)}`, // Encode the auth credentials
        },
      },
    );

    return new Response(JSON.stringify(response.data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    return new Response("Error fetching data", {status: 500});
  }
});
