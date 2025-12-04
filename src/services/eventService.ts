import { supabase } from '../lib/supabase';
import { Event } from '../types';

export const eventService = {
  async getEvents(page = 1, limit = 10, search = '', upcomingOnly = false) {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (upcomingOnly) {
      query = query.gte('start_date', new Date().toISOString());
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('start_date', { ascending: true });

    if (error) throw error;

    return { data: data as Event[], count };
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Event;
  },

  async createEvent(event: Omit<Event, 'id'>) {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async updateEvent(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Event;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
