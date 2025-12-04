import { describe, it, expect, vi, beforeEach } from 'vitest';
import { smsService, validatePhoneNumber } from './smsService';
import { supabase } from '../lib/supabase';

// Mock the Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('SMS Service', () => {
  const mockedInvoke = vi.mocked(supabase.functions.invoke);

  beforeEach(() => {
    vi.clearAllMocks();
    smsService.clearLogs();
  });

  describe('validatePhoneNumber', () => {
    it('should normalize 02... numbers to 2332...', () => {
      expect(validatePhoneNumber('0244123456')).toBe('233244123456');
    });

    it('should normalize 9 digit numbers to 233...', () => {
      expect(validatePhoneNumber('244123456')).toBe('233244123456');
    });

    it('should keep 233... numbers as is', () => {
      expect(validatePhoneNumber('233244123456')).toBe('233244123456');
    });

    it('should return null for invalid numbers', () => {
      expect(validatePhoneNumber('123')).toBeNull();
      expect(validatePhoneNumber('abc')).toBeNull();
    });

    it('should clean non-digits', () => {
      expect(validatePhoneNumber('024-412-3456')).toBe('233244123456');
    });
  });

  describe('sendSMS', () => {
    it('should send SMS to valid recipients', async () => {
      mockedInvoke.mockResolvedValue({
        data: { success: true, data: { code: 'ok' } },
        error: null
      });

      const recipients = ['0244123456'];
      const message = 'Hello Test';

      const result = await smsService.sendSMS(recipients, message);

      expect(mockedInvoke).toHaveBeenCalledWith('send-sms', {
        body: {
          recipients: ['233244123456'],
          message: message
        }
      });

      expect(result[0]).toEqual({ success: true, data: { code: 'ok' } });
      expect(smsService.getLogs()).toHaveLength(1);
      expect(smsService.getLogs()[0].status).toBe('success');
    });

    it('should handle Edge Function invocation errors', async () => {
      // Mock invocation error (e.g., network issue reaching Supabase)
      mockedInvoke.mockResolvedValue({
        data: null,
        error: { message: 'Function invocation failed', name: 'FunctionsHttpError', context: {} }
      });

      const recipients = ['0244123456'];
      
      const result = await smsService.sendSMS(recipients, 'test');
      
      expect(smsService.getLogs()[0].status).toBe('failed');
      expect(smsService.getLogs()[0].error).toContain('Function invocation failed');
      expect(result[0]).toHaveProperty('error');
    });

    it('should handle API errors returned by Edge Function', async () => {
      // Mock successful invocation but Edge Function returns success: false
      mockedInvoke.mockResolvedValue({
        data: { success: false, error: 'Arkesel Auth Failed' },
        error: null
      });

      const recipients = ['0244123456'];
      
      const result = await smsService.sendSMS(recipients, 'test');
      
      expect(smsService.getLogs()[0].status).toBe('failed');
      expect(smsService.getLogs()[0].error).toContain('SMS sending failed via Edge Function');
    });
    
    it('should chunk large recipient lists', async () => {
       mockedInvoke.mockResolvedValue({
        data: { success: true, data: { code: 'ok' } },
        error: null
      });
      
      // Generate 60 numbers
      const recipients = Array.from({ length: 60 }, (_, i) => `02440000${i < 10 ? '0' + i : i}`);
      
      await smsService.sendSMS(recipients, 'bulk test');
      
      expect(mockedInvoke).toHaveBeenCalledTimes(2); // 50 + 10
    });

    it('should throw error if no valid recipients', async () => {
        const recipients = ['invalid', '123'];
        await expect(smsService.sendSMS(recipients, 'test')).rejects.toThrow('No valid recipients found');
    });
  });
});
