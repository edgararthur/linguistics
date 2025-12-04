import { supabase } from '../lib/supabase';
import { FinanceRecord, Expense, ReportType } from '../types';

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
  },

  // Expense methods
  async createExpense(expense: Omit<Expense, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();

    if (error) throw error;
    return data as Expense;
  },

  async getExpenses(page = 1, limit = 10, category?: string) {
    let query = supabase
      .from('expenses')
      .select('*', { count: 'exact' });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .range(from, to)
      .order('date', { ascending: false });

    if (error) throw error;
    return { data: data as Expense[], count };
  },

  async getExpenseStats() {
    const currentYear = new Date().getFullYear();
    const startOfYear = `${currentYear}-01-01`;

    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category')
      .gte('date', startOfYear);

    if (error) throw error;

    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;

    data?.forEach(exp => {
      totalExpenses += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    return { totalExpenses, categoryTotals };
  },

  // Report generation
  async generateReport(type: ReportType, startDate: string, endDate: string) {
    switch (type) {
      case 'income_statement':
        return await this.generateIncomeStatement(startDate, endDate);
      case 'expense_summary':
        return await this.generateExpenseSummary(startDate, endDate);
      case 'dues_report':
        return await this.generateDuesReport(startDate, endDate);
      case 'full_financial':
        return await this.generateFullFinancialReport(startDate, endDate);
      default:
        throw new Error('Invalid report type');
    }
  },

  async generateIncomeStatement(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('finance_records')
      .select('amount, type')
      .eq('status', 'paid')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const breakdown: { type: string; total: number }[] = [];
    const typeTotals: Record<string, number> = {};
    let totalIncome = 0;

    data?.forEach(record => {
      totalIncome += record.amount;
      typeTotals[record.type] = (typeTotals[record.type] || 0) + record.amount;
    });

    Object.entries(typeTotals).forEach(([type, total]) => {
      breakdown.push({ type, total });
    });

    return { breakdown, totalIncome };
  },

  async generateExpenseSummary(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('amount, category')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    const breakdown: { category: string; total: number }[] = [];
    const categoryTotals: Record<string, number> = {};
    let totalExpenses = 0;

    data?.forEach(exp => {
      totalExpenses += exp.amount;
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    Object.entries(categoryTotals).forEach(([category, total]) => {
      breakdown.push({ category, total });
    });

    return { breakdown, totalExpenses };
  },

  async generateDuesReport(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('finance_records')
      .select('amount, status')
      .eq('type', 'dues')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;

    let paidCount = 0;
    let paidAmount = 0;
    let pendingCount = 0;
    let pendingAmount = 0;

    data?.forEach(record => {
      if (record.status === 'paid') {
        paidCount++;
        paidAmount += record.amount;
      } else if (record.status === 'pending') {
        pendingCount++;
        pendingAmount += record.amount;
      }
    });

    return { paidCount, paidAmount, pendingCount, pendingAmount };
  },

  async generateFullFinancialReport(startDate: string, endDate: string) {
    const incomeStatement = await this.generateIncomeStatement(startDate, endDate);
    const expenseSummary = await this.generateExpenseSummary(startDate, endDate);

    return {
      totalIncome: incomeStatement.totalIncome,
      totalExpenses: expenseSummary.totalExpenses,
      netBalance: incomeStatement.totalIncome - expenseSummary.totalExpenses,
      incomeBreakdown: incomeStatement.breakdown,
      expenseBreakdown: expenseSummary.breakdown
    };
  }
};

