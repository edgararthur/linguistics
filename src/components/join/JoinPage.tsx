import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, User, Users, Building2, ArrowRight } from 'lucide-react';
import gsap from '../../utils/gsapConfig';

const benefits = [
  "Access to exclusive research publications",
  "Networking opportunities with linguistics scholars",
  "Discounted conference registration fees",
  "Monthly newsletter subscription",
  "Participation in workshops and seminars",
  "Access to research grants and funding opportunities"
];

const membershipTypes = [
  {
    title: "Student",
    price: "GH₵50",
    description: "For current students in linguistics or related fields",
    icon: User,
    features: ["Digital access to publications", "Student events access", "Mentorship opportunities"],
    color: "blue"
  },
  {
    title: "Professional",
    price: "GH₵200",
    description: "For linguistics professionals and researchers",
    icon: Users,
    features: ["Full publication access", "Voting rights", "Research collaboration opportunities"],
    color: "yellow"
  },
  {
    title: "Institutional",
    price: "GH₵1000",
    description: "For departments, organizations and research centers",
    icon: Building2,
    features: ["Multiple member accounts", "Conference exhibition space", "Logo on website", "Job posting privileges"],
    color: "blue"
  }
];

export default function JoinPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

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
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center hero-content">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Join Our <span className="text-yellow-400">Association</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Become part of Ghana's leading linguistics community and contribute to the preservation and study of our languages.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Benefits Section */}
        <div className="animate-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Membership Benefits</h2>
            <p className="text-gray-600 mt-4">Why you should join the Linguistics Association of Ghana</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-300">
                  <div className="mt-1 bg-yellow-100 p-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membership Types */}
        <div className="animate-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="text-gray-600 mt-4">Select the membership tier that suits you best</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {membershipTypes.map((type) => (
              <div key={type.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative group">
                <div className={`h-2 w-full ${type.color === 'yellow' ? 'bg-yellow-400' : 'bg-blue-600'}`}></div>
                <div className="p-8 flex-grow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${type.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                    <type.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.title}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-gray-900">{type.price}</span>
                    <span className="text-gray-500 ml-2">/year</span>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">{type.description}</p>
                  <ul className="space-y-3 mb-8">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${type.color === 'yellow' ? 'bg-yellow-400' : 'bg-blue-600'}`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <Link 
                    to="/register" 
                    className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold transition-all transform group-hover:-translate-y-1 ${
                      type.color === 'yellow' 
                        ? 'bg-yellow-400 text-blue-900 hover:bg-yellow-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Register Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Contact Hint */}
        <div className="animate-section text-center bg-blue-50 rounded-2xl p-8 border border-blue-100">
          <p className="text-gray-700 mb-4">
            Have questions about membership? Need assistance with registration?
          </p>
          <Link to="/contact" className="text-blue-600 font-bold hover:underline">
            Contact our support team
          </Link>
        </div>

      </div>
    </div>
  );
}
