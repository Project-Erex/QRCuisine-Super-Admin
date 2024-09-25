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
