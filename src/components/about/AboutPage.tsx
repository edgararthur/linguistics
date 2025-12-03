import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Globe, Award, History as HistoryIcon, Target } from 'lucide-react';
import gsap from '../../utils/gsapConfig';
import { leaders } from '../../data/leaders';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Section Animations
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.from(section, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      // Timeline Animation
      gsap.from('.milestone-card', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: historyRef.current,
          start: 'top 75%',
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const milestones = [
    { year: '1963', title: 'Foundation', description: 'Established as the "Linguistics Circle of Accra" by a group of dedicated researchers.' },
    { year: '2006', title: 'Revival', description: 'Revived and rebranded as "The Linguistics Association of Ghana (LAG)" to broaden its scope.' },
    { year: '2010', title: 'First Annual Conference', description: 'Held the inaugural LAG conference, setting the stage for yearly academic gatherings.' },
    { year: '2024', title: 'Digital Transformation', description: 'Launched new digital platforms to connect linguists globally.' }
  ];

  const committees = [
    { name: 'Executive Committee', description: 'Oversees the general administration and strategic direction of the association.' },
    { name: 'Editorial Board', description: 'Manages the Ghana Journal of Linguistics and other publications.' },
    { name: 'Conference Committee', description: 'Organizes the annual LAG conference and other academic events.' },
    { name: 'Student Chapter', description: 'Coordinates activities and mentorship for student members.' }
  ];

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl hero-content">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Advancing Linguistic <span className="text-yellow-400">Scholarship</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              The Linguistics Association of Ghana (LAG) is the premier body for linguistic research, 
              documentation, and preservation in Ghana. We connect scholars, students, and enthusiasts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 animate-section">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To advance scholarship concerning the role of language in society as it relates to group and individual behavior. We aim to:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2.5 shrink-0"></div>
                <span>Foster growth of scholarly research in language and social psychology.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2.5 shrink-0"></div>
                <span>Provide forums for members to share socially significant research.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2.5 shrink-0"></div>
                <span>Promote scholarship addressing pressing and historical social issues.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To be a leading international hub for linguistic research, fostering a deep understanding of Ghanaian and African languages while contributing to global linguistic theory and application. We envision a society where linguistic diversity is celebrated and preserved through rigorous academic inquiry.
            </p>
          </div>
        </div>

        {/* History Section */}
        <div ref={historyRef} className="animate-section">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-blue-600 rounded-lg">
              <HistoryIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our History</h2>
          </div>
          
          <div className="relative border-l-4 border-blue-100 ml-6 space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className="milestone-card relative pl-8">
                <div className="absolute -left-[1.3rem] top-1 w-6 h-6 bg-white border-4 border-blue-600 rounded-full"></div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-blue-600 font-bold text-lg block mb-2">{milestone.year}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="animate-section">
           <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Organizational Structure</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Committees
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {committees.map((committee, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">{committee.name}</h4>
                      <p className="text-sm text-gray-600">{committee.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Membership Benefits</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Access to the Ghana Journal of Linguistics</span>
                  </div>
                   <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Discounted conference registration fees</span>
                  </div>
                   <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Networking with global scholars</span>
                  </div>
                   <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Voting rights in association elections</span>
                  </div>
                </div>
                <Link to="/join" className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-800">
                  Become a member <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            {/* Leadership Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
                <div className="flex justify-between items-end mb-6">
                   <h3 className="text-xl font-bold text-gray-900">Leadership</h3>
                   <Link to="/leadership" className="text-sm text-blue-600 hover:underline">View all</Link>
                </div>
               
                <div className="space-y-6">
                  {leaders.slice(0, 3).map((leader, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img 
                        src={leader.imageUrl} 
                        alt={leader.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{leader.name}</h4>
                        <p className="text-xs text-blue-600 font-medium">{leader.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="animate-section bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Contribute to Linguistics?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join a community of passionate researchers and scholars dedicated to the study and preservation of languages in Ghana.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/join" 
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 rounded-xl font-bold hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                Join LAG Now
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        </div>

      </div>
    </div>
  );
}
