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
    <Card className="group hover:border-l-4 hover:border-yellow-500 transition-all duration-300" interactive>
      <div className="flex items-start space-x-4">
        <div className="bg-yellow-100 p-3 rounded-lg group-hover:bg-yellow-500 transition-colors duration-300">
          <FileText className="h-6 w-6 text-yellow-600 group-hover:text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 mb-2 font-medium">{authors}</p>
          <p className="text-gray-600 mb-4">{abstract}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{date}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="interactive hover:bg-yellow-500 hover:text-white hover:border-transparent"
              onClick={() => window.open(downloadUrl, '_blank')}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}