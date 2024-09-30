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
    // Insert new row into 'cloudinary' table
    const {data, error} = await supabase
      .from("cloudinary")
      .insert([{title, cloud_name, upload_preset, apiKey, apiSecret}]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error inserting data:", error.message);
    alert("Failed to insert Cloudinary data");
  }
};
