import React, { useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { Expense, ExpenseCategory } from '../../types';
import { financeService } from '../../services/financeService';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
    { value: 'administrative', label: 'Administrative' },
    { value: 'events', label: 'Events' },
    { value: 'publications', label: 'Publications' },
    { value: 'travel', label: 'Travel' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' },
];

export default function ExpenseModal({ isOpen, onClose, onSave }: ExpenseModalProps) {
    const [formData, setFormData] = useState<Partial<Expense>>({
        category: 'administrative',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        receipt_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await financeService.createExpense(formData as Omit<Expense, 'id' | 'created_at'>);
            onSave();
            onClose();
            // Reset form
            setFormData({
                category: 'administrative',
                description: '',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                receipt_url: ''
            });
        } catch (err: any) {
            console.error('Error saving expense:', err);
            setError(err.message || 'Failed to save expense');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError(null);
        setFormData({
            category: 'administrative',
            description: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            receipt_url: ''
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Record Expense">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                    >
                        {EXPENSE_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={3}
                        placeholder="Describe the expense..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Receipt URL (Optional)</label>
                    <input
                        type="url"
                        placeholder="https://..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={formData.receipt_url || ''}
                        onChange={(e) => setFormData({ ...formData, receipt_url: e.target.value })}
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={handleClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Record Expense'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
