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
    <Card className="group hover:border-l-4 hover:border-yellow-500 transition-all duration-300 h-full" interactive>
      <div className="flex items-start space-x-4 p-2">
        <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-500 transition-colors duration-300 flex-shrink-0">
          <Calendar className="h-6 w-6 text-yellow-600 group-hover:text-white" />
        </div>
        <div className="flex-1 flex flex-col h-full">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">{title}</h3>
          <div className="text-sm text-gray-500 mb-3 space-y-1">
            <p className="font-medium flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              {date}
            </p>
            <p className="flex items-center pl-4">
              {location}
            </p>
          </div>
          <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{description}</p>
          <div className="mt-auto pt-4 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm" 
              className="interactive w-full sm:w-auto hover:bg-yellow-500 hover:text-white hover:border-transparent transition-all duration-300 group-hover:shadow-md"
              onClick={() => window.open(registrationUrl, '_blank')}
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}