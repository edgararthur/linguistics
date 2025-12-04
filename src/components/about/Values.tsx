import React from 'react';
import { BookOpen, Users, Globe, Library } from 'lucide-react';
import Card from '../shared/Card';

const values = [
    {
        icon: BookOpen,
        title: 'Academic Excellence',
        description: 'Promoting rigorous research and scholarly work in linguistics'
    },
    {
        icon: Users,
        title: 'Collaboration',
        description: 'Fostering partnerships between researchers and institutions'
    },
    {
        icon: Globe,
        title: 'Cultural Preservation',
        description: "Protecting and documenting Ghana's linguistic diversity"
    },
    {
        icon: Library,
        title: 'Education',
        description: 'Supporting linguistic education and professional development'
    }
];

export default function Values() {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                    <Card key={index}>
                        <div className="flex items-start">
                            <value.icon className="h-6 w-6 text-blue-600 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
