import React, { useEffect, useState } from 'react';
import { Search, Plus, FileText, Download, Eye, Edit, Trash2, Loader } from 'lucide-react';
import Button from '../../components/shared/Button';
import Pagination from '../../components/shared/Pagination';
import { Publication } from '../../types';
import { publicationService } from '../../services/publicationService';
import { useToast } from '../../contexts/ToastContext';
import PublicationModal from '../components/PublicationModal';

export default function Publications() {
  const { showToast } = useToast();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPublications();
  }, [refreshKey, searchTerm, currentPage]);

  async function fetchPublications() {
    try {
      setLoading(true);
      const { data, count } = await publicationService.getPublications(currentPage, itemsPerPage, searchTerm);
      setPublications(data);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await publicationService.deletePublication(id);
        showToast('Publication deleted successfully', 'success');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting publication:', error);
        showToast('Failed to delete publication', 'error');
      }
    }
  };

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPublication(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publications Management</h1>
          <p className="text-slate-500">Manage journals, articles, and research papers.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Publication
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search publications..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author(s)</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Downloads</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : publications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No publications found.
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className="font-medium text-slate-900 line-clamp-1 max-w-xs" title={pub.title}>{pub.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm max-w-xs truncate" title={pub.authors}>{pub.authors}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm capitalize">{pub.type}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                        {pub.publication_date ? new Date(pub.publication_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        <Download className="w-3 h-3 mr-1" />
                        {pub.downloads_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {pub.file_url && (
                            <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50" title="View">
                                <Eye className="w-4 h-4" />
                            </a>
                        )}
                        <button 
                          onClick={() => handleEdit(pub)}
                          className="p-2 text-slate-400 hover:text-yellow-600 rounded-full hover:bg-yellow-50" 
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pub.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50" 
                          title="Delete"
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
      
      <PublicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        publication={selectedPublication}
        onSave={handleSave}
      />
    </div>
  );
}
