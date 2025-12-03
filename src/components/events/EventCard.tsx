import React from 'react';
import { Calendar } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

type EventCardProps = {
  title: string;
  date: string;
  location: string;
  description: string;
  registrationUrl: string;
};

export default function EventCard({
  title,
  date,
  location,
  description,
  registrationUrl
}: EventCardProps) {
  return (
    <Card className="group hover:bg-yellow-50 transition-colors duration-300" interactive>
      <div className="flex items-start space-x-4">
        <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-500 transition-colors duration-300">
          <Calendar className="h-6 w-6 text-yellow-600 group-hover:text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">{title}</h3>
          <div className="text-sm text-gray-500 mb-2">
            <p className="font-medium">{date}</p>
            <p>{location}</p>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          <Button variant="outline" size="sm" className="interactive hover:bg-yellow-500 hover:text-white hover:border-transparent">
            Register Now
          </Button>
        </div>
      </div>
    </Card>
  );
}