import React from 'react';
import Card from '../shared/Card';
import { Mail, Briefcase, BookOpen, Building2 } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  profession: string;
  specialization: string;
  institution: string;
  bio: string;
  imageUrl: string;
}

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col items-center text-center">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-blue-100"
        />
        <h3 className="text-sm font-semibold text-gray-900 mb-1">{member.name}</h3>
        
        <div className="w-full mt-2 text-xs">
          <div className="flex items-center text-gray-600 mb-1">
            <Mail className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="text-left truncate">{member.email}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-1">
            <Briefcase className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="text-left truncate">{member.profession}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-1">
            <BookOpen className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="text-left truncate">{member.specialization}</span>
          </div>
          
          <div className="flex items-center text-gray-600 mb-1">
            <Building2 className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="text-left truncate">{member.institution}</span>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 text-left border-t mt-2 pt-2">
        <p className="line-clamp-2">{member.bio}</p>
      </div>
    </Card>
  );
} 