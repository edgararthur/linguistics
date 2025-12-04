import React, { useEffect, useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { FinanceRecord, Member } from '../../types';
import { financeService } from '../../services/financeService';
import { memberService } from '../../services/memberService';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function FinanceModal({ isOpen, onClose, onSave }: FinanceModalProps) {
  const [formData, setFormData] = useState<Partial<FinanceRecord>>({
    member_id: '',
    amount: 0,
    type: 'dues',
    status: 'paid',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMembers();
      setFormData({
        member_id: '',
        amount: 0,
        type: 'dues',
        status: 'paid',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [isOpen]);

  const loadMembers = async () => {
      try {
          const { data } = await memberService.getMembers(1, 1000); // Load all for dropdown
          setMembers(data);
      } catch (e) {
          console.error("Failed to load members", e);
      }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await financeService.createTransaction(formData as Omit<FinanceRecord, 'id'>);
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving transaction:', err);
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Payment">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Member</label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.member_id}
            onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
          >
            <option value="">Select Member</option>
            {members.map(m => (
                <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.email})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Amount (GHS)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
        </div>
        
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                    <option value="dues">Membership Dues</option>
                    <option value="donation">Donation</option>
                    <option value="event_fee">Event Fee</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
        </div>
        
         <div>
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Record Payment' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
