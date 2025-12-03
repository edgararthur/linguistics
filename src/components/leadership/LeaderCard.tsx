import React from 'react';
import Card from '../shared/Card';

type LeaderCardProps = {
  name: string;
  position: string;
  description: string;
  image: string;
};

export default function LeaderCard({ name, image, description, position }: LeaderCardProps) {
  return (
    <Card className="group hover:bg-yellow-50 transition-colors duration-300" interactive>
      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full border-4 border-yellow-100 group-hover:border-yellow-500 transition-all duration-300">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">{name}</h3>
        <p className="text-yellow-600 font-medium mb-2">{position}</p>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Card>
  );
}
