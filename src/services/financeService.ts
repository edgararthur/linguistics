import { supabase } from '../lib/supabase';
import { FinanceRecord } from '../types';

export const financeService = {
  async getTransactions(page = 1, limit = 10, search = '') {
    let query = supabase
      .from('finance_records')
      .select('*, member:members(first_name, last_name)', { count: 'exact' });

    if (search) {
      // Note: Searching on joined tables is tricky in Supabase. 
      // For simplicity, we'll search on description and type for now.
      // Advanced search would require RPC or specific indexing.
      query = query.or(`description.ilike.%${search}%,type.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('date', { ascending: false });

    if (error) throw error;

    return { data: data as (FinanceRecord & { member: { first_name: string; last_name: string } | null })[], count };
  },

  async createTransaction(transaction: Omit<FinanceRecord, 'id'>) {
    const { data, error } = await supabase
      .from('finance_records')
      .insert(transaction)
      .select()
      .single();

    if (error) throw error;
    return data as FinanceRecord;
  },
  
  async getStats() {
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;
      
      const { data: records, error } = await supabase
        .from('finance_records')
        .select('amount, status, type')
        .gte('date', startOfYear);
        
      if (error) throw error;
      
      let totalRevenue = 0;
      let outstanding = 0;
      let pendingCount = 0;
      
      records?.forEach(r => {
          if (r.status === 'paid') {
              totalRevenue += r.amount;
          } else if (r.status === 'pending') {
              outstanding += r.amount;
              pendingCount++;
          }
      });
      
      return { totalRevenue, outstanding, pendingCount };
  },

  async getOutstandingMembers() {
    const { data, error } = await supabase
        .from('finance_records')
        .select('amount, member:members(id, first_name, last_name, phone, email)')
        .eq('status', 'pending')
        .eq('type', 'dues');
    
    if (error) throw error;
    
    const outstandingMap = new Map<string, { member: any, total: number }>();
    
    data?.forEach((record: any) => {
        if (record.member) {
            const id = record.member.id;
            if (!outstandingMap.has(id)) {
                outstandingMap.set(id, { member: record.member, total: 0 });
            }
            outstandingMap.get(id)!.total += record.amount;
        }
    });
    
    return Array.from(outstandingMap.values());
  },

  async getChartData() {
     const currentYear = new Date().getFullYear();
     const startOfYear = `${currentYear}-01-01`;

     const { data: records } = await supabase
        .from('finance_records')
        .select('amount, status, date')
        .gte('date', startOfYear);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const chartData = months.map(m => ({ name: m, collected: 0, outstanding: 0 }));
      
      records?.forEach(r => {
          const date = new Date(r.date);
          const monthIndex = date.getMonth();
          
          if (r.status === 'paid') {
              chartData[monthIndex].collected += r.amount;
          } else {
              chartData[monthIndex].outstanding += r.amount;
          }
      });
      
      return chartData;
  }
};
