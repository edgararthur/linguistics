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
    const { recipients, message } = await req.json()

    if (!recipients || !message) {
      throw new Error('Missing recipients or message')
    }

    // Arkesel API Configuration
    const apiKey = Deno.env.get('SMS_API_KEY')
    const senderId = Deno.env.get('SMS_SENDER_ID') || 'LAG'
    const apiUrl = 'https://sms.arkesel.com/sms/api'

    if (!apiKey) {
      throw new Error('SMS_API_KEY not configured in Supabase secrets')
    }

    // Join recipients with comma
    const to = Array.isArray(recipients) ? recipients.join(',') : recipients;

    // Call Arkesel API
    // Arkesel uses GET request with query params for the basic API
    const url = new URL(apiUrl)
    url.searchParams.append('action', 'send-sms')
    url.searchParams.append('api_key', apiKey)
    url.searchParams.append('to', to)
    url.searchParams.append('from', senderId)
    url.searchParams.append('sms', message)

    const response = await fetch(url.toString(), {
      method: 'GET',
    })

    const data = await response.json()

    // Check Arkesel specific response codes
    // success: { code: 'ok', ... } or { code: '100' ... }
    const isSuccess = data.code === 'ok' || data.code === '100' || data.code === '101' || (data.status && data.status.toLowerCase() === 'success');

    if (!isSuccess) {
      console.error('Arkesel Error:', data);
      throw new Error(data.message || 'Failed to send SMS via Arkesel')
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Edge Function Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred', success: false }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Use 400 for client errors, or 500 for server errors. 
      }
    )
  }
})
