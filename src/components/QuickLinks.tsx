import React from 'react';
import { BookOpen, Users, Calendar, FileText } from 'lucide-react';

const links = [
  {
    title: 'Publications',
    description: 'Access our research papers and journals',
    icon: BookOpen,
    href: '/publications'
  },
  {
    title: 'Membership',
    description: 'Join our growing community',
    icon: Users,
    href: '/join'
  },
  {
    title: 'Events',
    description: 'Stay updated with our activities',
    icon: Calendar,
    href: '/events'
  },
  {
    title: 'Resources',
    description: 'Educational materials and tools',
    icon: FileText,
    href: '/resources'
  }
];

export default function QuickLinks() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <link.icon className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {link.title}
              </h3>
              <p className="text-gray-600">{link.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}