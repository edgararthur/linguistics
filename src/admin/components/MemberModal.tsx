import React, { useEffect, useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { Member, MembershipType } from '../../types';
import { memberService } from '../../services/memberService';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
  onSave: () => void;
}

export default function MemberModal({ isOpen, onClose, member, onSave }: MemberModalProps) {
  const [formData, setFormData] = useState<Partial<Member>>({
    first_name: '',
    last_name: '',
    email: '',
    affiliation: '',
    research_area: '',
    membership_type: 'Professional',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        affiliation: '',
        research_area: '',
        membership_type: 'Professional',
        status: 'active',
      });
    }
  }, [member, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic Phone Validation
    if (formData.phone) {
        const phoneRegex = /^(\+?\d{10,15})$/;
        const cleanedPhone = formData.phone.replace(/[\s\-]/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
            setError('Please enter a valid phone number (10-15 digits).');
            setLoading(false);
            return;
        }
    }

    try {
      if (member?.id) {
        await memberService.updateMember(member.id, formData);
      } else {
        await memberService.createMember(formData as Omit<Member, 'id' | 'created_at'>);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving member:', err);
      setError(err.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={member ? 'Edit Member' : 'Add New Member'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            placeholder="+233..."
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Affiliation</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.affiliation}
            onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.membership_type}
              onChange={(e) => setFormData({ ...formData, membership_type: e.target.value as MembershipType })}
            >
              <option value="Professional">Professional</option>
              <option value="Student">Student</option>
              <option value="Institutional">Institutional</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
