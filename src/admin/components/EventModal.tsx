import React, { useEffect, useState } from 'react';
import Modal from '../../components/shared/Modal';
import Button from '../../components/shared/Button';
import { Event } from '../../types';
import { eventService } from '../../services/eventService';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSave: () => void;
}

export default function EventModal({ isOpen, onClose, event, onSave }: EventModalProps) {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    registration_url: '',
    organizer: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        registration_url: '',
        organizer: '',
        image_url: ''
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
        const payload = {
            ...formData,
            // Ensure empty strings are converted to null where appropriate or handled
        } as Omit<Event, 'id'>;

      if (event?.id) {
        await eventService.updateEvent(event.id, formData);
      } else {
        await eventService.createEvent(payload);
      }
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Event' : 'Create New Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, start_date: new Date(e.target.value).toISOString() })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData({ ...formData, end_date: new Date(e.target.value).toISOString() })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        
         <div>
          <label className="block text-sm font-medium text-gray-700">Registration URL (Optional)</label>
          <input
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            value={formData.registration_url || ''}
            onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
