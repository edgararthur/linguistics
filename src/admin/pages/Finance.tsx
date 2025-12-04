import React, { useEffect, useState } from 'react';
import { DollarSign, FileText, TrendingUp, CreditCard, AlertCircle, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from '../../components/shared/Button';
import Pagination from '../../components/shared/Pagination';
import { financeService } from '../../services/financeService';
import { smsService } from '../../services/smsService';
import { useToast } from '../../contexts/ToastContext';
import FinanceModal from '../components/FinanceModal';
import { supabase } from '../../lib/supabase';

export default function Finance() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalRevenue: 0, outstanding: 0, pendingCount: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sendingReminders, setSendingReminders] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchData();
  }, [refreshKey, currentPage]);

  async function fetchData() {
    try {
      setLoading(true);

      // Fetch payments from Supabase
      const { data: payments, count, error } = await supabase
        .from('payments')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) throw error;

      setTransactions(payments || []);
      setTotalItems(count || 0);

      // Calculate Stats (Simplified for now, ideally backend function)
      // For total revenue, we might need a separate query or aggregate function
      // Here we just fetch a summary if possible, or use the financeService for other stats if they are still relevant
      // For now, let's try to get total revenue from a separate query
      const { data: revenueData } = await supabase
        .from('payments')
        .select('total_amount')
        .eq('status', 'paid'); // Assuming 'paid' or 'completed'

      const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.total_amount || 0), 0) || 0;

      // Pending count
      const { count: pendingCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      setStats({
        totalRevenue,
        outstanding: 0, // Needs logic to calculate outstanding dues
        pendingCount: pendingCount || 0
      });

      // Chart data - placeholder or fetch from service if it has logic
      const chartData = await financeService.getChartData();
      setChartData(chartData);

    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSendReminders = async () => {
    if (!window.confirm('Are you sure you want to send SMS reminders to all members with outstanding dues?')) {
      return;
    }

    setSendingReminders(true);
    try {
      const outstandingMembers = await financeService.getOutstandingMembers();

      if (outstandingMembers.length === 0) {
        showToast('No members with outstanding dues found.', 'info');
        return;
      }

      let sentCount = 0;
      let failedCount = 0;

      // Send sequentially to avoid rate limits or overwhelming the API
      for (const item of outstandingMembers) {
        if (item.member.phone) {
          try {
            await smsService.sendPaymentReminder(
              item.member.phone,
              `${item.member.first_name} ${item.member.last_name}`,
              item.total
            );
            sentCount++;
          } catch (e) {
            console.error(`Failed to send SMS to ${item.member.first_name}:`, e);
            failedCount++;
          }
        } else {
          console.warn(`Skipping ${item.member.first_name} (no phone number)`);
          failedCount++;
        }
      }

      showToast(`Reminders Processed: Sent ${sentCount}, Failed/Skipped ${failedCount}`, 'success');
    } catch (error) {
      console.error('Error sending reminders:', error);
      showToast('Failed to process reminders.', 'error');
    } finally {
      setSendingReminders(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Dues</h1>
          <p className="text-slate-500">Track payments, invoices, and financial reports.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500">Total Revenue (YTD)</p>
              <h3 className="text-2xl font-bold text-slate-900">GH₵ {stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-green-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Verified Payments
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500">Outstanding Dues</p>
              <h3 className="text-2xl font-bold text-slate-900">GH₵ {stats.outstanding.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <button
            onClick={handleSendReminders}
            disabled={sendingReminders}
            className="text-sm text-blue-600 hover:underline mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingReminders ? 'Sending...' : 'Send Reminders'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500">Pending Verifications</p>
              <h3 className="text-2xl font-bold text-slate-900">{stats.pendingCount} Payments</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:underline mt-1">Review Transactions</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue vs Outstanding</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value}`} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outstanding" name="Outstanding" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Transactions</h3>
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader className="w-6 h-6 text-yellow-500 animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent transactions.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(trx => (
                  <div key={trx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-50">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {trx.payer_name || 'Unknown Payer'}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{trx.network || 'Payment'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">GH₵ {trx.total_amount}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full capitalize ${trx.status === 'paid' || trx.status === 'completed' || trx.status === 'success' ? 'bg-green-100 text-green-700' :
                        trx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {trx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-2">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <FinanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
