import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. " +
    "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// ---------------------------------------------------------------------------
// Storage helpers — wraps Supabase Storage for notice images.
// Bucket name: "notice-images"  (create this bucket in your Supabase dashboard)
// ---------------------------------------------------------------------------

const BUCKET = "notice-images";

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL of the uploaded file on success.
 * Throws on error.
 *
 * @param {File} file  - The File object to upload.
 * @returns {Promise<string>}  Public URL string.
 */
export async function uploadToSupabase(file) {
  if (!file) throw new Error("No file provided.");

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("Could not retrieve public URL from Supabase Storage.");
  }

  return data.publicUrl;
}
