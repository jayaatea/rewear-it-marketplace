
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { createHmac } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const RAZORPAY_API_SECRET = Deno.env.get("RAZORPAY_API_SECRET") || "";

if (!RAZORPAY_API_SECRET) {
  console.error("Razorpay API secret is not configured!");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature, 
      db_order_id 
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !db_order_id) {
      return new Response(
        JSON.stringify({ error: "Missing required payment verification data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const secretKey = encoder.encode(RAZORPAY_API_SECRET);
    
    const hmac = createHmac("sha256", secretKey);
    hmac.update(data);
    const generatedSignature = Array.from(new Uint8Array(await hmac.digest()))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return new Response(
        JSON.stringify({ error: "Payment verification failed: Invalid signature" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Update the order in our database
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", db_order_id)
      .eq("razorpay_order_id", razorpay_order_id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      order_id: order.id,
      status: "Payment successful"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
