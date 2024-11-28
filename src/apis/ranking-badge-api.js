import supabase from "@/configs/supabase";

export async function getRankingBadgeApis() {
  try {
    let query = supabase
      .from("ranking_badge")
      .select(`*`)
      .order("sorting", {ascending: false});

    const {data, error} = await query;
    if (error) {
      throw error;
    } else {
      return {data};
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
export async function updatedRankingBadge(id, updatedData) {
  try {
    const {data, error} = await supabase
      .from("ranking_badge")
      .update(updatedData)
      .eq("id", id);

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

export async function InsertRank(updatedData) {
  try {
    const {data, error} = await supabase
      .from("ranking_badge")
      .insert(updatedData)
      .select();

    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}

export async function deleteRank(value) {
  try {
    const {data, error} = await supabase
      .from("ranking_badge")
      .delete()
      .eq("id", value.id)
      .select();
    if (error) {
      throw error;
    } else {
      return data;
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}
