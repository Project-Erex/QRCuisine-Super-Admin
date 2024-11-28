import supabase from "@/configs/supabase";

export async function getCloudinaryApis() {
  try {
    let query = supabase
      .from("restaurants")
      .select(`*,cloudinary_id(*)`, {count: "exact"})
      .order("created_at", {ascending: false});

    const {data, count, error} = await query;
    if (error) {
      throw error;
    } else {
      return {data, count};
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export const insertCloudinaryData = async (
  title,
  cloud_name,
  upload_preset,
  apiKey,
  apiSecret,
) => {
  try {
    // Check if cloud_name already exists
    const {data: existingData, error: selectError} = await supabase
      .from("cloudinary")
      .select("cloud_name,upload_preset,apiKey,apiSecret")
      .eq("cloud_name", cloud_name)
      .eq("upload_preset", upload_preset)
      .eq("apiKey", apiKey)
      .eq("apiSecret", apiSecret);

    if (selectError) {
      throw selectError;
    }

    if (existingData.length > 0) {
      throw new Error(
        "A record with this Cloud name, upload preset, API key, and API secret already exists. Please use different values.",
      );
    }

    const {data, error} = await supabase
      .from("cloudinary")
      .insert([{title, cloud_name, upload_preset, apiKey, apiSecret}]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
};
