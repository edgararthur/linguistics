import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

type PublicationCardProps = {
  title: string;
  authors: string;
  abstract: string;
  downloadUrl: string;
  date: string;
};

export default function PublicationCard({
  title,
  authors,
  abstract,
  downloadUrl,
  date
}: PublicationCardProps) {
  return (
    <Card>
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{authors}</p>
          <p className="text-gray-600 mb-4">{abstract}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{date}</span>
            <Button variant="outline" size="sm">
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}