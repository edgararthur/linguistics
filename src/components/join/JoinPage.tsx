import React, { useEffect, useRef } from 'react';
import { CheckCircle, Building2 } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
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
    features: ["Digital access to publications", "Student events access", "Mentorship opportunities"]
  },
  {
    title: "Professional",
    price: "GH₵200",
    description: "For linguistics professionals and researchers",
    features: ["Full publication access", "Voting rights", "Research collaboration opportunities"]
  },
  {
    title: "Institutional",
    price: "GH₵1000",
    description: "For departments, organizations and research centers",
    features: ["Multiple member accounts", "Conference exhibition space", "Logo on website", "Job posting privileges"]
  }
];

export default function JoinPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.header-animate', {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.benefit-item', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.benefits-section',
          start: 'top 80%',
        }
      });

      gsap.from('.membership-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.membership-section',
          start: 'top 80%',
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 header-animate">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Join Our Association</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Become part of Ghana's leading linguistics community and contribute to the preservation and study of our languages.
          </p>
        </div>

        <div className="mb-16 benefits-section">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center space-x-3 benefit-item">
                <CheckCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 membership-section">
          {membershipTypes.map((type) => (
            <div key={type.title} className="membership-card h-full">
              <Card className="h-full flex flex-col hover:border-yellow-400 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-2" interactive>
                <div className="text-center flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <div className="text-4xl font-bold text-yellow-600 mb-4">
                    {type.price}
                    <span className="text-sm text-gray-500 font-normal">/year</span>
                  </div>
                  <p className="text-gray-600 mb-8 min-h-[48px]">{type.description}</p>
                  <ul className="space-y-4 mb-8 text-left">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="primary" className="w-full bg-yellow-500 text-black font-bold hover:bg-yellow-400 interactive">
                  Join Now
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}