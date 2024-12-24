import React, { useState } from 'react';
import PublicationCard from './PublicationCard';

const publications = [
  {
    title: "Tone Systems in Ghanaian Languages: A Comparative Analysis",
    authors: "Dr. Kwame Mensah, Dr. Abena Osei",
    abstract: "This study examines the tonal patterns across major Ghanaian languages...",
    downloadUrl: "#",
    date: "March 2024"
  },
  {
    title: "Language Contact in Urban Ghana",
    authors: "Dr. Yaw Addo, Prof. Sarah Johnson",
    abstract: "An investigation into language mixing and code-switching in urban areas...",
    downloadUrl: "#",
    date: "February 2024"
  },
  {
    title: "Documentation of Endangered Ghanaian Languages",
    authors: "Prof. Emmanuel Kotey",
    abstract: "A comprehensive documentation project focusing on three endangered languages...",
    downloadUrl: "#",
    date: "January 2024"
  }
];

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPublications = publications.filter(pub => 
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect(() => {
	// 	const fetchData = async () => {
	// 	  try {
	// 		const response = await axios.get("http://127.0.0.1:8000/api/leadership/");
	// 		setData(response.data);
	// 		// console.log(response)
	// 	  } catch (error) {
	// 		console.error("Error fetching data:", error);
	// 		setData([]);
	// 	  }
	// 	};
	
	// 	fetchData();
	// }, []);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Publications</h1>
          <p className="mt-4 text-xl text-gray-600">
            Explore our research publications and scholarly works
          </p>
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search publications..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-6">
          {filteredPublications.map((pub) => (
            <PublicationCard key={pub.title} {...pub} />
          ))}
        </div>
      </div>
    </div>
  );
}