import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Loader } from 'lucide-react';
import Button from '../../components/shared/Button';
import Pagination from '../../components/shared/Pagination';
import { Leader } from '../../types';
import { leadershipService } from '../../services/leadershipService';
import { useToast } from '../../contexts/ToastContext';
import LeaderModal from '../components/LeaderModal';

export default function AdminLeadership() {
  const { showToast } = useToast();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeaders();
  }, [refreshKey, searchTerm, currentPage]);

  async function fetchLeaders() {
    try {
      setLoading(true);
      const { data, count } = await leadershipService.getLeaders(currentPage, itemsPerPage, searchTerm);
      setLeaders(data);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error fetching leadership:', error);
      showToast('Failed to fetch leaders', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leader?')) {
      try {
        await leadershipService.deleteLeader(id);
        showToast('Leader deleted successfully', 'success');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting leader:', error);
        showToast('Failed to delete leader', 'error');
      }
    }
  };

  const handleEdit = (leader: Leader) => {
    setSelectedLeader(leader);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLeader(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leadership Management</h1>
          <p className="text-slate-500">Manage executive committee members and roles.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Leader
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : leaders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No leaders found.
                  </td>
                </tr>
              ) : (
                leaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 overflow-hidden mr-3">
                          {leader.image_url ? (
                            <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <span className="font-medium text-slate-900">{leader.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{leader.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        leader.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {leader.is_current ? 'Current' : 'Past'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{leader.display_order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(leader)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(leader.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination 
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      <LeaderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        leader={selectedLeader} 
        onSave={handleSave} 
      />
    </div>
  );
}
