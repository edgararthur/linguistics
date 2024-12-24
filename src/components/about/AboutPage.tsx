import React from 'react';
import Mission from './Mission';
import Values from './Values';
import History from './History';
import Vision from './Vision'

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
          <p className="mt-4 text-xl text-gray-600">
            Advancing linguistic research and preservation in Ghana
          </p>
        </div>
        
        <Mission />
        <Vision />
        <Values />
        <History />
      </div>
    </div>
  );
}