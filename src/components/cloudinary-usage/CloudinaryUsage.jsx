import React, {useState, useEffect} from "react";
import {Card, CardBody, Typography, Spinner, Progress} from "@material-tailwind/react";

const cloudName = "drxwyotes"; // Replace with your actual Cloudinary cloud name
const apiKey = "749371497479183"; // Replace with your actual Cloudinary API key
const apiSecret = "yX9sQyShyf5usndtLYTx7J5TPAo"; // Be careful! Insecure to expose this directly

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeWFnbHZ4dXppcWZjeHd0eW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3Mjc3OTQsImV4cCI6MjA0MjMwMzc5NH0.NCYQ-48zeXzqSeeAsGS_voi5T8LdONE9NXxdvIxOrYU";

export default function CloudinaryUsage({cloudName, apiKey, apiSecret}) {
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUsageStats = async () => {
      try {
        const response = await fetch(
          `https://icyaglvxuziqfcxwtymo.supabase.co/functions/v1/cloud-function?cloudName=${cloudName}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
              Authorization: `Bearer ${supabaseKey}`, // Use Supabase JWT authentication
            },
          },
        ); // Replace with your Supabase function URL
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setUsageData(data); // Set the fetched usage data
        setLoading(false); // Stop the loading spinner
        console.log("Usage Statistics:", data);
        return data;
      } catch (error) {
        console.error("Error fetching usage statistics:", error);
        setLoading(false);
      }
    };

    getUsageStats();
  }, []);

  if (loading) {
    return (
      <div className="flex w-full h-[350px] justify-center items-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-[350px] justify-center items-center">
        <Typography variant="h6" color="red" className="font-normal">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-4">
        <Typography color="blue-gray" variant="h6">
          Storage Usage
        </Typography>
        <Typography color="blue-gray" variant="h6">
          {usageData.credits.used_percent}%
        </Typography>
      </div>
      <Progress value={usageData.credits.used_percent} />
    </div>
  );
}
