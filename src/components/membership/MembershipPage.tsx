import React, { useState, useEffect, useRef } from 'react';
import MemberCard from './MemberCard';
import { Member, fetchMembersFromGoogleForms, getMockMembers } from './googleFormsUtils';
import gsap from '../../utils/gsapConfig';

const MembershipPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<'real' | 'sample'>('real');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load members when component mounts
    loadMembers();
  }, []);

  useEffect(() => {
    if (!loading && members.length > 0 && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current, {
          y: -30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        gsap.from('.member-card', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
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
      setUsingFallback(false);
      
      // Try to fetch from the published Google Sheet directly
      console.log('Attempting to fetch member data from Google Sheet...');
      const data = await fetchMembersFromGoogleForms('');
      
      if (data.length === 0) {
        throw new Error('No data returned from Google Sheet');
      }
      
      setMembers(data);
      setDataSource('real');
      
      // Check if we're using fallback data (static copy) or actual live data
      // This assumes the fetchMembersFromGoogleForms function sets a console warning when using fallback
      const consoleMessages = (console.warn as any).calls?.all?.() || [];
      const usingFallbackData = consoleMessages.some((msg: any) => 
        msg?.args?.[0] === 'Using extracted data as fallback'
      );
      
      setUsingFallback(usingFallbackData);
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load member data. Please try again or use sample data.');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    try {
      const sampleData = getMockMembers();
      setMembers(sampleData);
      setDataSource('sample');
      setUsingFallback(false);
      setError(null);
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError('Failed to load sample data. Something is seriously wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" ref={containerRef}>
      <div ref={headerRef}>
        <h1 className="text-lg font-semibold mb-2">LAG Members</h1>
        <p className="text-gray-600 mb-6 text-xs">Members of the Linguistics Association of Ghana</p>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-600">Fetching member data...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold mb-2">{error}</p>
          <div className="flex space-x-4">
            <button 
              onClick={loadMembers} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {usingFallback && !loading && !error && dataSource === 'real' && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p>
            <span className="font-semibold">Note:</span> Unable to connect to the live Google Sheet due to browser security restrictions. 
            Showing extracted LAG member data instead.
          </p>
        </div>
      )}

      {dataSource === 'sample' && !loading && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Showing sample data. This is not actual LAG member information.</p>
          <button 
            onClick={loadMembers} 
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Load LAG Member Data
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-700 text-xs font-medium flex justify-end">
              <p className='text-gray-700 text-xs font-medium justify-end align-middle flex'>
                {members.length} member{members.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {members.map((member, index) => (
              <div key={`${member.firstName}-${member.lastName}-${index}`} className="member-card h-full">
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MembershipPage; 