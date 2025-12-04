import { supabase } from '../lib/supabase';
import { Member } from '../types';

export const memberService = {
  async getMembers(page = 1, limit = 12, search = '', status?: string) {
    let query = supabase
      .from('members')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('last_name', { ascending: true }); // Order by last name for directory

    if (error) throw error;

    return { data: data as Member[], count };
  },

  async getMemberById(id: string) {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Member;
  },

  async createMember(member: Omit<Member, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  async updateMember(id: string, updates: Partial<Member>) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Member;
  },

  async deleteMember(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getMemberStats() {
    const { count: total } = await supabase.from('members').select('*', { count: 'exact', head: true });
    const { count: active } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: pending } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    return { total, active, pending };
  },

  async getAllMemberPhones() {
    const { data, error } = await supabase
      .from('members')
      .select('phone')
      .not('phone', 'is', null)
      .neq('phone', '');

    if (error) throw error;
    return data.map(m => m.phone).filter(p => p) as string[];
  }
};
