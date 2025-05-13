
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  user_id: string;
  cart_items: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );
    
    // Parse request body
    const { amount, currency, user_id, cart_items }: RazorpayOrderRequest = await req.json();
    
    if (!amount || !currency || !user_id) {
      throw new Error("Missing required parameters");
    }
    
    // In a real implementation, you'd use the Razorpay API to create an order
    // For now, we'll create a mock order
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_YOUR_KEY_HERE";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    
    console.log("Creating Razorpay order for user:", user_id);
    console.log("Amount:", amount, currency);
    
    // Mock order creation - in production, call the actual Razorpay API
    const orderId = "order_" + Math.random().toString(36).substring(2, 15);
    
    // Log the order
    console.log("Created order:", orderId);
    
    // This would be a good place to save the order to your database
    
    return new Response(
      JSON.stringify({
        orderId: orderId,
        keyId: razorpayKeyId,
        success: true,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error generating Razorpay order:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
