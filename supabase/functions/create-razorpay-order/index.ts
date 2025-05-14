
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const RAZORPAY_API_KEY = Deno.env.get("RAZORPAY_API_KEY") || "";
const RAZORPAY_API_SECRET = Deno.env.get("RAZORPAY_API_SECRET") || "";

if (!RAZORPAY_API_KEY || !RAZORPAY_API_SECRET) {
  console.error("Razorpay API credentials are not configured!");
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
    const { amount, currency = "INR", userId } = body;

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Amount is required and must be greater than 0" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Create an order in the Razorpay API
    const auth = btoa(`${RAZORPAY_API_KEY}:${RAZORPAY_API_SECRET}`);
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise/cents
        currency: currency,
        receipt: `order_${Date.now()}`,
      }),
    });

    const razorpayResponse = await response.json();

    if (!razorpayResponse.id) {
      throw new Error("Failed to create Razorpay order");
    }

    // Store the order in our database
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        amount: amount,
        currency: currency,
        razorpay_order_id: razorpayResponse.id,
        status: "created",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return new Response(JSON.stringify({
      order_id: razorpayResponse.id,
      currency: razorpayResponse.currency,
      amount: razorpayResponse.amount / 100,
      db_order_id: order.id
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
