import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, message } = await req.json()

    if (!phoneNumber || !message) {
      throw new Error('Missing phoneNumber or message')
    }

    // SMSOnlineGH API Configuration
    // You should set these in your Supabase project secrets
    const apiKey = Deno.env.get('SMS_API_KEY')
    const senderId = Deno.env.get('SMS_SENDER_ID') || 'LAG'

    if (!apiKey) {
      throw new Error('SMS_API_KEY not configured')
    }

    // Construct the URL for SMSOnlineGH
    // Note: This is a placeholder URL structure. Please verify with SMSOnlineGH documentation.
    // Common format: https://api.smsonlinegh.com/v4/message/sms/send
    const apiUrl = 'https://api.smsonlinegh.com/v4/message/sms/send'
    
    const payload = {
      text: message,
      type: 0,
      sender: senderId,
      destinations: [phoneNumber]
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`SMS Gateway Error: ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'An unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
