import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Edit, Trash2, Loader } from 'lucide-react';
import { memberService } from '../../services/memberService';
import { Member } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import MemberModal from '../components/MemberModal';
import Pagination from '../../components/shared/Pagination';

export default function Members() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadMembers();
  }, [refreshKey, filterStatus, searchTerm, currentPage]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const status = filterStatus === 'All' ? undefined : filterStatus.toLowerCase();
      const { data, count } = await memberService.getMembers(currentPage, itemsPerPage, searchTerm, status);
      setMembers(data);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.deleteMember(id);
        showToast('Member deleted successfully', 'success');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting member:', error);
        showToast('Failed to delete member', 'error');
      }
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Member Management</h1>
          <p className="text-slate-500">Manage membership, approvals, and profiles.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button 
            onClick={handleCreate}
            className="px-4 py-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 text-sm font-medium flex items-center"
          >
            <Mail className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members by name, email, or institution..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Institution</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold mr-3">
                          {member.image_url ? (
                            <img src={member.image_url} alt={member.last_name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            (member.first_name?.[0] || '') + (member.last_name?.[0] || '')
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.title ? `${member.title} ` : ''}{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{member.affiliation}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{member.membership_type}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{member.region || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${member.status === 'active' ? 'bg-green-100 text-green-800' : 
                          member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(member)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
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

      <MemberModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        member={selectedMember}
        onSave={handleSave}
      />
    </div>
  );
}
