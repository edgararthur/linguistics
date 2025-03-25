import React, { useState, useEffect } from 'react';
import MemberCard from './MemberCard';
import { Users, Filter } from 'lucide-react';
import { Member, fetchMembersFromGoogleForms, getMockMembers } from './googleFormsUtils';

export default function MembershipPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch member data from Google Forms spreadsheet
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // Replace with your actual Google Sheet ID
        const sheetId = 'YOUR_SHEET_ID';
        
        const membersData = await fetchMembersFromGoogleForms(sheetId);
        setMembers(membersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('Failed to load members. Please try again later.');
        setLoading(false);
        
        // For development purposes, using placeholder data if API fails
        setMembers(getMockMembers());
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Members</h1>
          <p className="mt-2 text-lg text-gray-600">
            Meet the linguists and language enthusiasts in our community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && members.length === 0 ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {filteredMembers.length} Members
                </h2>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {filteredMembers.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMembers.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No members found matching your search criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 