// supabase/functions/cloudinaryUsage/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import axios from "https://cdn.skypack.dev/axios";
import { corsHeaders } from '../_shared/cors.ts';

interface CloudinaryValidationResponse {
  valid: boolean;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const cloudName = url.searchParams.get("cloudName");
  const uploadPreset = url.searchParams.get("uploadPreset");
  const apiKey = url.searchParams.get("apiKey");
  const apiSecret = url.searchParams.get("apiSecret");

  // Check if all required parameters are provided
  if (!cloudName || !uploadPreset || !apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ message: "Missing required parameters" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const auth = `${apiKey}:${apiSecret}`;

  try {
    // Make a request to Cloudinary to validate the credentials
    // For validation, we can call Cloudinary's usage or upload endpoint with basic auth
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image`, // Endpoint for checking the credentials
      {
        headers: {
          Authorization: `Basic ${btoa(auth)}`, 
        },
      }
    );

    // If the request is successful, we can further check the upload preset
    const presetResponse = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload_presets/${uploadPreset}`,
      {
        headers: {
          Authorization: `Basic ${btoa(auth)}`,
        },
      }
    );

    // If both requests are successful, return valid response
    return new Response(
      JSON.stringify({ valid: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error validating Cloudinary credentials:", error);
    const errorResponse: ErrorResponse = {
      message: "Invalid Cloudinary credentials or upload preset",
      status: 400
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
