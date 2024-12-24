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
    <Card>
      <div className="flex flex-col items-center text-center">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h3 className="text-md font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-800 mb-2">{position}</p>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
}