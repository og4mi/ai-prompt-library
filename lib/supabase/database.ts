import { createClient } from "./client";
import type { Prompt } from "@/types";

// Convert our Prompt type to database format
function promptToDb(prompt: Prompt, userId: string) {
  return {
    id: prompt.id,
    user_id: userId,
    title: prompt.title,
    content: prompt.content,
    category: prompt.category,
    tags: prompt.tags,
    source_url: prompt.sourceUrl,
    ai_model: prompt.aiModel,
    notes: prompt.notes,
    is_favorite: prompt.isFavorite,
    usage_count: prompt.usageCount,
    last_used: prompt.lastUsed,
    collection_id: prompt.collectionId,
    is_template: prompt.isTemplate,
  };
}

// Convert database format to our Prompt type
function dbToPrompt(dbPrompt: any): Prompt {
  return {
    id: dbPrompt.id,
    title: dbPrompt.title,
    content: dbPrompt.content,
    category: dbPrompt.category,
    tags: dbPrompt.tags || [],
    sourceUrl: dbPrompt.source_url,
    aiModel: dbPrompt.ai_model,
    dateAdded: dbPrompt.created_at,
    notes: dbPrompt.notes,
    isFavorite: dbPrompt.is_favorite,
    usageCount: dbPrompt.usage_count,
    lastUsed: dbPrompt.last_used,
    collectionId: dbPrompt.collection_id,
    isTemplate: dbPrompt.is_template,
  };
}

export async function fetchPrompts(userId: string): Promise<Prompt[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }

  return (data || []).map(dbToPrompt);
}

export async function createPrompt(prompt: Prompt, userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .insert([promptToDb(prompt, userId)])
    .select()
    .single();

  if (error) throw error;
  return dbToPrompt(data);
}

export async function updatePrompt(prompt: Prompt, userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .update(promptToDb(prompt, userId))
    .eq("id", prompt.id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return dbToPrompt(data);
}

export async function deletePrompt(promptId: string, userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prompts")
    .delete()
    .eq("id", promptId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function syncLocalPromptsToDb(prompts: Prompt[], userId: string) {
  const supabase = createClient();

  // Convert all prompts to database format
  const dbPrompts = prompts.map((p) => promptToDb(p, userId));

  // Batch insert (upsert to handle duplicates)
  const { data, error } = await supabase
    .from("prompts")
    .upsert(dbPrompts, { onConflict: "id" })
    .select();

  if (error) throw error;
  return (data || []).map(dbToPrompt);
}

export async function fetchCategories(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function fetchUserSettings(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error fetching settings:", error);
  }

  return data;
}

export async function updateUserSettings(
  userId: string,
  settings: { view_mode?: string; theme?: string }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .upsert({ user_id: userId, ...settings }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
