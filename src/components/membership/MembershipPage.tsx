import React, { useState, useEffect, useRef } from 'react';
import { memberService } from '../../services/memberService';
import { Member } from '../../types';
import gsap from '../../utils/gsapConfig';
import { Users, AlertCircle, RefreshCw, User, ChevronLeft, ChevronRight, Search, Mail, MapPin, GraduationCap, BookOpen, Globe } from 'lucide-react';

const MemberCard = ({ member }: { member: Member }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && detailsRef.current) {
      gsap.to(detailsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (detailsRef.current) {
      gsap.to(detailsRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="member-card relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group h-[400px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-24 bg-blue-900 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
      </div>
      <div className="px-6 -mt-12 flex-1 flex flex-col relative z-10">
        <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-gray-100 shrink-0">
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={`${member.first_name} ${member.last_name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
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

        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {member.first_name} {member.last_name}
          </h3>
          <p className="text-sm text-blue-600 font-medium mb-1 line-clamp-1">{member.affiliation}</p>
          <div className="flex gap-2 mt-2">
            <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              {member.membership_type}
            </span>
            {member.country && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                <MapPin className="w-3 h-3 mr-1" /> {member.country}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 line-clamp-3">
            <span className="font-semibold text-gray-700">Research:</span> {member.research_area}
          </p>
        </div>
      </div>

      {/* Hover Details Overlay */}
      <div
        ref={detailsRef}
        className="absolute inset-0 bg-blue-900/95 text-white p-6 flex flex-col opacity-0 translate-y-4 transition-all duration-300 z-20 overflow-y-auto"
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
      >
        <h3 className="text-xl font-bold mb-1">{member.first_name} {member.last_name}</h3>
        <p className="text-blue-200 text-sm mb-4">{member.affiliation}</p>

        <div className="space-y-3 text-sm">
          {member.qualification && (
            <div className="flex items-start">
              <GraduationCap className="w-4 h-4 mt-1 mr-2 text-yellow-400 shrink-0" />
              <span>{member.qualification}</span>
            </div>
          )}

          {member.research_area && (
            <div className="flex items-start">
              <BookOpen className="w-4 h-4 mt-1 mr-2 text-yellow-400 shrink-0" />
              <span>{member.research_area}</span>
            </div>
          )}

          {member.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-yellow-400 shrink-0" />
              <a href={`mailto:${member.email}`} className="hover:text-yellow-400 transition-colors truncate">
                {member.email}
              </a>
            </div>
          )}



          {member.profile_url && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-yellow-400 shrink-0" />
              <a href={member.profile_url} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors truncate">
                View Profile
              </a>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4">
          <span className="text-xs text-blue-300 block">Joined: {member.joined_year || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

import PayDuesModal from './PayDuesModal';

const MembershipPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [isPayDuesModalOpen, setIsPayDuesModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 12;

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMembers();
  }, [page, search]);


  useEffect(() => {
    if (!loading && members.length > 0 && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(headerRef.current, {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        // Animate cards with clearProps to ensure they're fully visible after animation
        gsap.from('.member-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'opacity,transform', // Clear inline styles after animation
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, members]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, count } = await memberService.getMembers(page, ITEMS_PER_PAGE, search, 'active');

      setMembers(data || []);
      if (count !== null) {
        setTotalCount(count);
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
    } catch (err) {
      console.error('Error loading members:', err);
      setError('Failed to load member data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadMembers();
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
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Meet the scholars, researchers, and students driving linguistic excellence in Ghana.
            </p>

            <button
              onClick={() => setIsPayDuesModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-blue-900 bg-yellow-400 hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-8"
            >
              Pay Dues Online
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <PayDuesModal isOpen={isPayDuesModalOpen} onClose={() => setIsPayDuesModalOpen(false)} />

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
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">Showing {members.length} of {totalCount} members</p>
            </div>

            {members.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 members-grid">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <div className="flex items-center gap-2">
                      {(() => {
                        const pages = [];
                        const maxVisible = 5;
                        let start = Math.max(1, page - Math.floor(maxVisible / 2));
                        let end = Math.min(totalPages, start + maxVisible - 1);

                        if (end - start + 1 < maxVisible) {
                          start = Math.max(1, end - maxVisible + 1);
                        }

                        for (let p = start; p <= end; p++) {
                          pages.push(
                            <button
                              key={p}
                              onClick={() => setPage(p)}
                              className={`w-10 h-10 rounded-full font-medium transition-colors ${page === p
                                ? 'bg-blue-900 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                              {p}
                            </button>
                          );
                        }
                        return pages;
                      })()}
                    </div>

                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No members found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search terms.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
