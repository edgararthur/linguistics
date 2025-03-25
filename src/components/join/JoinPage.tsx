import React from 'react';
import { CheckCircle } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

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
  }
];

export default function JoinPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Join Our Association</h1>
          <p className="mt-4 text-xl text-gray-600">
            Become part of Ghana's leading linguistics community
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {membershipTypes.map((type) => (
            <Card key={type.title}>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {type.price}
                  <span className="text-sm text-gray-500">/year</span>
                </div>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <ul className="space-y-3 mb-6 text-left">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="primary">Join Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}