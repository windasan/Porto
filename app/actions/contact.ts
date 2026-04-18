// app/actions/contact.ts
"use server";

export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export async function sendMessage(formData: FormData): Promise<FormState> {
  const name    = formData.get("name")?.toString().trim()    ?? "";
  const email   = formData.get("email")?.toString().trim()   ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  // Basic validation
  if (!name || !email || !message) {
    return { status: "error", message: "All fields are required." };
  }

  try {
    // Simulasi delay (Nantinya ganti dengan logika Resend/Supabase Edge Functions di sini)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Console log ini akan muncul di terminal server, bukan di browser
    console.log("Pesan diterima:", { name, email, message });

    return { status: "success" };
  } catch (error) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}