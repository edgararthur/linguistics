import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import gsap from '../../utils/gsapConfig';
import { Users, AlertCircle, RefreshCw, User } from 'lucide-react';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  affiliation: string;
  research_area: string;
  image_url?: string;
  membership_type: string;
}

const MemberCard = ({ member }: { member: Member }) => (
  <div className="member-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full flex flex-col">
    <div className="h-24 bg-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
    </div>
    <div className="px-6 -mt-12 flex-1 flex flex-col">
      <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-100">
        {member.image_url ? (
          <img 
            src={member.image_url} 
            alt={`${member.first_name} ${member.last_name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center');
              (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {member.first_name} {member.last_name}
        </h3>
        <p className="text-sm text-blue-600 font-medium mb-1">{member.affiliation}</p>
        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          {member.membership_type}
        </span>
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100 pb-6">
        <p className="text-sm text-gray-500 line-clamp-2">
          <span className="font-semibold text-gray-700">Research:</span> {member.research_area}
        </p>
      </div>
    </div>
  </div>
);

const MembershipPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (!loading && members.length > 0 && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        gsap.from('.member-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.members-grid',
            start: 'top 80%',
          },
        });
      }, containerRef);
      
      return () => ctx.revert();
    }
  }, [loading, members]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'active')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      
      setMembers(data || []);
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load member data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center" ref={headerRef}>
            <div className="inline-flex items-center justify-center p-3 bg-blue-800 rounded-xl mb-6">
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Members</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Meet the scholars, researchers, and students driving linguistic excellence in Ghana.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start justify-between">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-red-800 font-medium">Unable to load members</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button 
              onClick={loadMembers}
              className="flex items-center text-red-700 hover:text-red-900 font-medium text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading directory...</p>
          </div>
        ) : (
          <>
            {members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 members-grid">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No members found</h3>
                <p className="text-gray-500 mt-1">The directory is currently empty.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
