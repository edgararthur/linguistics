import React, { useEffect, useState } from 'react';
import { Users, FileText, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Loader } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  </div>
);

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    publications: 0,
    events: 0
  });
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsData, distribution, growth] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMembershipDistribution(),
        dashboardService.getGrowthData()
      ]);
      
      setStats(statsData);
      setPieData(distribution);
      setChartData(growth);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
             Download Report
           </button>
           <button className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 text-sm font-medium">
             + New Member
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Total Members" 
          value={stats.totalMembers} 
          trend="up" 
          trendValue="+12%" 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={FileText} 
          label="Publications" 
          value={stats.publications} 
          trend="up" 
          trendValue="+4%" 
          color="bg-green-500" 
        />
        <StatCard 
          icon={Calendar} 
          label="Active Events" 
          value={stats.events} 
          trend="up" 
          trendValue="2 Upcoming" 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={DollarSign} 
          label="Active Members" 
          value={stats.activeMembers} 
          trend="down" 
          trendValue="-2%" 
          color="bg-yellow-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Membership Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="dues" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Member Status</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
