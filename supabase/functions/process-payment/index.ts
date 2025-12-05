import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
    amount: number;
    payerName: string;
    payerPhone: string;
    network: string;
    memberId?: string;
}

// Helper to map frontend network names to ExpressPay expected values
function mapNetworkToProvider(network: string): string {
    const n = network.toUpperCase();
    if (n === 'TELECEL' || n === 'VODAFONE') return 'VODAFONE';
    if (n === 'AIRTELTIGO' || n === 'AT') return 'AIRTELTIGO';
    return 'MTN'; // Default to MTN
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

        const { amount, payerName, payerPhone, network, memberId } = await req.json() as PaymentRequest

        if (!amount || !payerPhone || !network) {
            throw new Error('Missing required payment details')
        }

        // Payment Distribution Logic
        // Calculate split (Frontend passes Total Amount)
        const serviceFee = Number(Deno.env.get('SERVICE_FEE') || 2.00);
        const duesAmount = Number(amount) - serviceFee;
        
        if (duesAmount < 0) {
             throw new Error(`Invalid amount: Must be greater than service fee (${serviceFee.toFixed(2)} GHS)`);
        }

        console.log(`[Payment Split] Processing transaction for ${payerPhone}:`);
        console.log(`- Total Amount: ${amount}`);
        console.log(`- Dues Amount (Recipient): ${duesAmount}`);
        console.log(`- Service Fee (Provider): ${serviceFee}`);

        // ExpressPay API Integration
        const MERCHANT_ID = Deno.env.get('EXPRESSPAY_MERCHANT_ID');
        const API_KEY = Deno.env.get('EXPRESSPAY_API_KEY');
        const ENV = Deno.env.get('EXPRESSPAY_ENV') || 'sandbox';
        
        const BASE_URL = ENV === 'sandbox' 
            ? 'https://sandbox.expresspaygh.com/api' 
            : 'https://expresspaygh.com/api';

        // If credentials are missing, fallback to mock
        if (!MERCHANT_ID || !API_KEY || MERCHANT_ID === 'your_merchant_id') {
            console.warn('ExpressPay credentials missing. Using MOCK implementation.');
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockRef = `MOCK-${crypto.randomUUID()}`;
            
            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Payment initiated successfully (Mock)',
                    data: {
                        status: 'PENDING',
                        reference: mockRef,
                        externalId: mockRef,
                        split: { dues: duesAmount, fee: serviceFee }
                    }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        // --- Step 1: Initiate Transaction (Get Token) ---
        const orderId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // We need to use URLSearchParams for x-www-form-urlencoded
        const initParams = new URLSearchParams();
        initParams.append('merchant-id', MERCHANT_ID);
        initParams.append('api-key', API_KEY);
        initParams.append('currency', 'GHS');
        initParams.append('amount', amount.toString());
        initParams.append('order-id', orderId);
        initParams.append('post-url', 'https://example.com/callback'); // TODO: Replace with actual callback if needed

        const initResp = await fetch(`${BASE_URL}/submit.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: initParams
        });

        const initData = await initResp.json();

        if (Number(initData.status) !== 1) {
            console.error('ExpressPay Init Error:', initData);
            throw new Error(`Payment initialization failed: ${initData.message || 'Unknown error'}`);
        }

        const token = initData.token;

        // --- Step 2: Submit Payment Details ---
        if (network === 'CARD') {
             // For Cards, we should ideally redirect to ExpressPay Checkout or use Direct API with PCI compliance.
             // For now, we'll return the Token and a Checkout URL (Standard Flow)
             return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Redirect to Payment Page',
                    data: {
                        status: 'REDIRECT_REQUIRED',
                        reference: orderId,
                        externalId: orderId,
                        checkout_url: `https://expresspaygh.com/api/checkout.php?token=${token}`,
                        split: { dues: duesAmount, fee: serviceFee }
                    }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
            )
        }

        const providerNetwork = mapNetworkToProvider(network);
        
        const payParams = new URLSearchParams();
        payParams.append('token', token);
        payParams.append('mobile-number', payerPhone);
        payParams.append('mobile-network', providerNetwork);

        const payResp = await fetch(`${BASE_URL}/submit.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payParams
        });

        const payData = await payResp.json();

        // Result: 1 = Approved, 4 = Pending
        const result = Number(payData.result);

        if (result !== 1 && result !== 4) {
            console.error('ExpressPay Payment Error:', payData);
            throw new Error(`Payment failed: ${payData['result-text'] || 'Transaction declined'}`);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: result === 1 ? 'Payment Approved' : 'Payment Pending Confirmation',
                data: {
                    status: result === 1 ? 'SUCCESS' : 'PENDING',
                    reference: payData['transaction-id'] || orderId,
                    externalId: orderId,
                    split: {
                        dues: duesAmount,
                        fee: serviceFee
                    }
                }
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error: any) {
        console.error('Function Error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message || 'Internal Server Error',
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
