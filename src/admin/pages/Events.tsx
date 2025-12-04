import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, MapPin, Users, Edit, Trash2, Loader } from 'lucide-react';
import Button from '../../components/shared/Button';
import Pagination from '../../components/shared/Pagination';
import { Event } from '../../types';
import { eventService } from '../../services/eventService';
import { useToast } from '../../contexts/ToastContext';
import EventModal from '../components/EventModal';

export default function Events() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9; // Grid layout, 9 fits well

  useEffect(() => {
    fetchEvents();
  }, [refreshKey, searchTerm, currentPage]);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, count } = await eventService.getEvents(currentPage, itemsPerPage, searchTerm);
      setEvents(data);
      setTotalItems(count || 0);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(id);
        showToast('Event deleted successfully', 'success');
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Failed to delete event', 'error');
      }
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatus = (date: string) => {
    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate > now) return 'Upcoming';
    return 'Completed';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
          <p className="text-slate-500">Create and manage conferences, workshops, and meetings.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getStatus(event.start_date);
            return (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-slate-100 relative">
                   <img 
                     src={event.image_url || `https://source.unsplash.com/random/800x600/?conference,meeting&sig=${event.id}`} 
                     alt={event.title} 
                     className="w-full h-full object-cover"
                   />
                   <div className="absolute top-2 right-2">
                     <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${
                       status === 'Upcoming' ? 'bg-blue-500 text-white' :
                       'bg-slate-500 text-white'
                     }`}>
                       {status}
                     </span>
                   </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 border-t border-slate-100 pt-4">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="flex-1 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200"
                    >
                      Manage
                    </button>
                    <button 
                      onClick={() => handleEdit(event)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <Pagination 
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        event={selectedEvent} 
        onSave={handleSave} 
      />
    </div>
  );
}
