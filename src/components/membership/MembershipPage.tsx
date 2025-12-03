import React, { useState, useEffect, useRef } from 'react';
import MemberCard from './MemberCard';
import { Member, fetchMembersFromGoogleForms, getMockMembers } from './googleFormsUtils';
import gsap from '../../utils/gsapConfig';
import { Users, AlertCircle, RefreshCw } from 'lucide-react';

const MembershipPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'sample'>('real');
  
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
      
      console.log('Attempting to fetch member data from Google Sheet...');
      const data = await fetchMembersFromGoogleForms();
      
      if (data.length === 0) {
        throw new Error('No data returned from Google Sheet');
      }
      
      setMembers(data);
      setDataSource('real');
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load member data. You can view sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    try {
      const sampleData = getMockMembers();
      setMembers(sampleData);
      setDataSource('sample');
      setError(null);
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError('Failed to load sample data.');
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
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-lg text-gray-600 font-medium">Loading member directory...</p>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-sm border border-red-100">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Members</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => loadMembers()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
              <button 
                onClick={loadSampleData}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                View Sample Data
              </button>
            </div>
          </div>
        )}

        {!loading && !error && members.length > 0 && (
          <>
            {dataSource === 'sample' && (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <p>Viewing sample data. Live data could not be loaded.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 members-grid">
              {members.map((member, index) => (
                <div key={`${member.firstName}-${member.lastName}-${index}`} className="member-card h-full">
                  <MemberCard member={member} />
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
              Showing {members.length} members
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
