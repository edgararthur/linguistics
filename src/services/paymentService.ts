import { supabase } from '../lib/supabase';

export interface PaymentRequest {
  amount: number;
  payerPhone: string;
  payerName: string;
  network: string;
  memberId?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data?: {
    reference: string;
    status: string;
    totalAmount: number;
  };
  error?: string;
}

export const paymentService = {
  async processPayment(paymentDetails: PaymentRequest): Promise<PaymentResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: paymentDetails
      });

      if (error) {
        throw new Error(error.message || 'Payment function invocation failed');
      }

      return data;
    } catch (error: any) {
      console.error('Payment Service Error:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: error.message
      };
    }
  },

  async getMyPayments() {
      const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
          
      if (error) throw error;
      return data;
  }
};
