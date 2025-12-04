import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { amount, payerName, payerPhone, network, memberId } = await req.json()

        if (!amount || !payerPhone || !network) {
            throw new Error('Missing required payment details')
        }

        // 1. Log the attempt (optional, since client already logs, but good for security)
        console.log(`Processing payment of ${amount} for ${payerName} (${payerPhone}) via ${network}`)

        // 2. Integrate with Payment Provider (e.g., Paystack, Hubtel)
        // This is a MOCK implementation. In production, replace with actual API call.

        // Simulate API call delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Success Response
        const mockProviderResponse = {
            status: 'success',
            reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            message: 'Payment initiated successfully'
        }

        // 3. Update the payment record in DB if passed, or create new one?
        // The client creates the record first. We could update it here if we had the ID.
        // For now, we just return the provider reference.

        // 4. Send SMS Confirmation (Optional, or handle via webhook)
        // const smsRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-sms`, { ... })

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Payment initiated successfully',
                data: mockProviderResponse
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
