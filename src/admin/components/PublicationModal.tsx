import React, { useEffect, useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { Publication } from '../../types';
import { publicationService } from '../../services/publicationService';

interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication?: Publication | null;
  onSave: () => void;
}

export default function PublicationModal({ isOpen, onClose, publication, onSave }: PublicationModalProps) {
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    authors: '',
    abstract: '',
    category: '',
    publication_date: new Date().toISOString().split('T')[0],
    type: 'journal',
    file_url: '',
    issn: '',
    doi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publication) {
      setFormData({
          ...publication,
          publication_date: publication.publication_date ? publication.publication_date.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        authors: '',
        abstract: '',
        category: '',
        publication_date: new Date().toISOString().split('T')[0],
        type: 'journal',
        file_url: '',
        issn: '',
        doi: ''
      });
    }
  }, [publication, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (publication?.id) {
        await publicationService.updatePublication(publication.id, formData);
      } else {
        await publicationService.createPublication(formData as Omit<Publication, 'id'>);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving publication:', err);
      setError(err.message || 'Failed to save publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={publication ? 'Edit Publication' : 'Add New Publication'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Authors</label>
          <input
            type="text"
            required
            placeholder="e.g., John Doe, Jane Smith"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.authors}
            onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Abstract</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.abstract}
            onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                    <option value="journal">Journal Article</option>
                    <option value="newsletter">Newsletter</option>
                    <option value="proceeding">Proceeding</option>
                    <option value="article">Article</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                 <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
            </div>
        </div>

         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Publication Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.publication_date}
                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">File URL (Optional)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.file_url || ''}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              />
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">ISSN (Optional)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.issn || ''}
                onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">DOI (Optional)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.doi || ''}
                onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              />
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Publication'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
