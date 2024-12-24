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
    <Card>
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div className="text-sm text-gray-500 mb-2">
            <p>{date}</p>
            <p>{location}</p>
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          <Button variant="outline" size="sm">
            Register Now
          </Button>
        </div>
      </div>
    </Card>
  );
}