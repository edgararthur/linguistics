import { supabase } from '../lib/supabase';
import { Publication } from '../types';

export const publicationService = {
  async getPublications(page = 1, limit = 10, search = '') {
    let query = supabase
      .from('publications')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,authors.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('publication_date', { ascending: false });

    if (error) throw error;

    return { data: data as Publication[], count };
  },

  async getPublicationById(id: string) {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Publication;
  },

  async createPublication(publication: Omit<Publication, 'id' | 'downloads_count' | 'views_count'>) {
    const { data, error } = await supabase
      .from('publications')
      .insert(publication)
      .select()
      .single();

    if (error) throw error;
    return data as Publication;
  },

  async updatePublication(id: string, updates: Partial<Publication>) {
    const { data, error } = await supabase
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Publication;
  },

  async deletePublication(id: string) {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
