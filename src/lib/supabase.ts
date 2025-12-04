import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(
  supabaseUrl || 'https://vzsjqilgptelhkbblzmo.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type Database = {
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          affiliation: string;
          research_area: string;
          membership_type: string;
          status: string;
          image_url: string | null;
        };
      };
      publications: {
        Row: {
          id: string;
          title: string;
          authors: string;
          abstract: string;
          category: string;
          publication_date: string;
          file_url: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          start_date: string;
          location: string;
          registration_url: string | null;
        };
      };
      leadership: {
        Row: {
          id: string;
          name: string;
          role: string;
          bio: string;
          image_url: string | null;
          is_current: boolean;
          display_order: number;
        };
      };
    };
  };
};
