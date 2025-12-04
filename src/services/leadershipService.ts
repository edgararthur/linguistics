import { supabase } from '../lib/supabase';
import { Leader } from '../types';

export const leadershipService = {
  async getLeaders(page: number = 1, limit: number = 10, searchTerm: string = '') {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from('leadership')
      .select('*', { count: 'exact' });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`);
    }

    const { data, count, error } = await query
      .order('display_order', { ascending: true })
      .range(start, end);

    if (error) throw error;
    
    return {
      data: data as Leader[],
      count
    };
  },

  async createLeader(leader: Omit<Leader, 'id'>) {
    const { data, error } = await supabase
      .from('leadership')
      .insert(leader)
      .select()
      .single();

    if (error) throw error;
    return data as Leader;
  },

  async updateLeader(id: string, updates: Partial<Leader>) {
    const { data, error } = await supabase
      .from('leadership')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Leader;
  },

  async deleteLeader(id: string) {
    const { error } = await supabase
      .from('leadership')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
