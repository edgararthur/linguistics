import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { Leader } from '../../types';
import { leadershipService } from '../../services/leadershipService';
import { useImageUpload } from '../../hooks/useImageUpload';
import { Upload, X, Loader } from 'lucide-react';

interface LeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leader?: Leader | null;
  onSave: () => void;
}

export default function LeaderModal({ isOpen, onClose, leader, onSave }: LeaderModalProps) {
  const [formData, setFormData] = useState<Partial<Leader>>({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    is_current: true,
    display_order: 0
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { uploadImage, uploading: imageUploading, error: uploadError } = useImageUpload();

  useEffect(() => {
    if (leader) {
      setFormData(leader);
    } else {
      setFormData({
        name: '',
        role: '',
        bio: '',
        image_url: '',
        is_current: true,
        display_order: 0
      });
    }
    setLocalError(null);
  }, [leader, isOpen]);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, 'leadership-images');
      setFormData(prev => ({ ...prev, image_url: url }));
    } catch (err) {
      // Error handled by hook, but we can also log here
      console.error("Upload failed in component", err);
    }
  }, [uploadImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      if (leader?.id) {
        await leadershipService.updateLeader(leader.id, formData);
      } else {
        await leadershipService.createLeader(formData as Omit<Leader, 'id'>);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving leader:', err);
      setLocalError(err.message || 'Failed to save leader');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={leader ? 'Edit Leader' : 'Add New Leader'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(localError || uploadError) && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
            {localError || uploadError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Leader Image</label>

          {formData.image_url ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <img
                src={formData.image_url}
                alt="Leader"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
            >
              <input {...getInputProps()} />
              {imageUploading ? (
                <div className="flex flex-col items-center text-gray-500">
                  <Loader className="w-8 h-8 animate-spin mb-2 text-blue-500" />
                  <p>Uploading image...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? 'Drop the image here' : 'Drag & drop image here, or click to select'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center pt-6">
            <input
              id="is_current"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.is_current}
              onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
            />
            <label htmlFor="is_current" className="ml-2 block text-sm text-gray-900">
              Current Leader
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading || imageUploading}>
            {loading ? 'Saving...' : 'Save Leader'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
