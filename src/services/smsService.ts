import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_KEY = import.meta.env.VITE_SMS_API_KEY;
const SENDER_ID = 'LAG'; // Needs to be registered with Arkesel
const API_URL = 'https://sms.arkesel.com/sms/api';

export interface SMSLog {
  id: string;
  timestamp: number;
  recipients: string[];
  message: string;
  status: 'success' | 'failed';
  providerResponse?: any;
  error?: string;
}

// In-memory log storage (could be persisted to localStorage or Supabase)
let smsLogs: SMSLog[] = [];

/**
 * Validates a phone number.
 * Arkesel prefers formats like 233XXXXXXXXX or 02XXXXXXXX.
 * We will normalize to 233XXXXXXXXX (international format without +).
 */
export const validatePhoneNumber = (phone: string): string | null => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Ghana specific validation
  if (cleaned.startsWith('233') && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return '233' + cleaned.substring(1);
  }
  // If it's 9 digits (missing leading 0), assume 233 + number
  if (cleaned.length === 9) {
    return '233' + cleaned;
  }

  // Return null if invalid
  return null;
};

/**
 * Chunk an array into smaller arrays
 */
const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const smsService = {
  /**
   * Send SMS to one or more recipients using Arkesel.
   * Handles rate limiting by chunking requests.
   */
  async sendSMS(to: string[], message: string) {
    if (!API_KEY) {
      const error = 'SMS API Key is missing. Please set VITE_SMS_API_KEY in .env';
      console.error(error);
      throw new Error(error);
    }

    // Validate and clean phone numbers
    const validRecipients = to
      .map(validatePhoneNumber)
      .filter((p): p is string => p !== null);

    if (validRecipients.length === 0) {
      throw new Error('No valid recipients found.');
    }

    // Arkesel generally handles bulk, but let's chunk to be safe (e.g., 100 per request)
    // to avoid URL length limits or timeout issues.
    const chunks = chunkArray(validRecipients, 50);
    const results = [];

    for (const chunk of chunks) {
      const recipientsStr = chunk.join(',');
      const logId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      try {
        // Arkesel API Parameters
        const response = await axios.get(API_URL, {
          params: {
            action: 'send-sms',
            api_key: API_KEY,
            to: recipientsStr,
            from: SENDER_ID,
            sms: message
          }
        });

        const result = response.data;
        const status = result.code === 'ok' || result.code === '100' || result.code === '101' ? 'success' : 'failed';

        // Log to Supabase
        await supabase.from('sms_logs').insert({
          recipients: chunk,
          message: message,
          status: status,
          provider_response: result
        });

        // Log success to local memory (optional, can be removed if using DB only)
        smsLogs.unshift({
          id: logId,
          timestamp: Date.now(),
          recipients: chunk,
          message,
          status: status,
          providerResponse: result
        });

        if (result.code !== 'ok' && result.code !== '100' && result.code !== '101' && !result.status?.toLowerCase().includes('success')) {
          if (result.code === '102' || result.message === 'Authentication Failed') {
            throw new Error('SMS Authentication Failed. Check API Key.');
          }
        }

        results.push(result);

        // Simple rate limit/delay between chunks
        if (chunks.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }

      } catch (error: any) {
        // Log failure to Supabase
        await supabase.from('sms_logs').insert({
          recipients: chunk,
          message: message,
          status: 'failed',
          error_message: error.message,
          provider_response: error.response?.data
        });

        // Log failure to local memory
        smsLogs.unshift({
          id: logId,
          timestamp: Date.now(),
          recipients: chunk,
          message,
          status: 'failed',
          error: error.message,
          providerResponse: error.response?.data
        });

        console.error('Error sending SMS chunk:', error);
        results.push({ error: error.message });
      }
    }

    return results;
  },

  async sendPaymentReminder(memberPhone: string, memberName: string, amount: number) {
    const message = `Hello ${memberName}, this is a gentle reminder from LAG regarding your outstanding dues of GH₵ ${amount}. Please kindly make payment. Thank you.`;
    return this.sendSMS([memberPhone], message);
  },

  async sendBroadcast(phoneNumbers: string[], message: string) {
    return this.sendSMS(phoneNumbers, message);
  },

  getLogs() {
    return smsLogs;
  },

  clearLogs() {
    smsLogs = [];
  }
};
