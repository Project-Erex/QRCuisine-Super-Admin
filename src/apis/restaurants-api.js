import supabase from "@/configs/supabase";

export async function getRestaurantsApis(page, pageSize, status, searchQuery) {
  try {
    let query = supabase
      .from("restaurants")
      .select(`*,cloudinary_id(*)`, {count: "exact"})
      .order("created_at", {ascending: false})
      .range((page - 1) * pageSize, page * pageSize - 1)
      .limit(pageSize);

    if (status !== "all") {
      query = query.eq("is_verified", status === "verified");
    }
    if (searchQuery) {
      query = query.ilike("restaurant_name", `%${searchQuery}%`);
    }
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

export async function getAllUsers() {
  try {
    const {data, error} = await supabase.auth.admin.listUsers();
    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching all users data:", error);
    throw error;
  }
}

export async function updatedRestaurants() {
  try {
    const {data, error} = await supabase.from("restaurants").update({is_verified: true});
    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

export async function getCloudinary() {
  try {
    const {data, error} = await supabase
      .from("cloudinary")
      .select(`*`)
      .order("title", {ascending: true});

    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
