import { supabase } from '../lib/supabase';

export const dashboardService = {
  async getStats() {
    const { count: totalMembers } = await supabase.from('members').select('*', { count: 'exact', head: true });
    const { count: activeMembers } = await supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: publications } = await supabase.from('publications').select('*', { count: 'exact', head: true });
    const { count: events } = await supabase.from('events').select('*', { count: 'exact', head: true });

    return {
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
      publications: publications || 0,
      events: events || 0
    };
  },
  
  async getMembershipDistribution() {
      // This is a bit heavier, maybe optimize later
      const { data } = await supabase.from('members').select('status');
      
      const distribution = {
          active: 0,
          inactive: 0,
          pending: 0
      };
      
      data?.forEach(m => {
          const status = m.status?.toLowerCase() as keyof typeof distribution;
          if (distribution[status] !== undefined) {
              distribution[status]++;
          }
      });
      
      return [
          { name: 'Active', value: distribution.active },
          { name: 'Inactive', value: distribution.inactive },
          { name: 'Pending', value: distribution.pending }
      ];
  },

  async getGrowthData() {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;

    // Get base member count before this year
    const { count: baseCount } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', startOfYear);

    // Fetch members created this year
    const { data: newMembers } = await supabase
      .from('members')
      .select('created_at')
      .gte('created_at', startOfYear);

    // Fetch finance records (revenue) for this year
    const { data: payments } = await supabase
      .from('finance_records')
      .select('amount, date')
      .eq('status', 'paid') // Include all paid records, not just dues
      .gte('date', startOfYear);

    // Initialize months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(name => ({ name, members: 0, dues: 0 }));

    // Process members (monthly new)
    newMembers?.forEach(m => {
      if (m.created_at) {
        const month = new Date(m.created_at).getMonth();
        if (data[month]) data[month].members++;
      }
    });

    // Process payments
    payments?.forEach(p => {
        const month = new Date(p.date).getMonth();
        if (data[month]) data[month].dues += p.amount;
    });

    // Calculate cumulative members
    let runningTotal = baseCount || 0;
    return data.map(d => {
        runningTotal += d.members;
        return { ...d, members: runningTotal };
    });
  }
};
