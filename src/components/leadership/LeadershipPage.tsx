import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useRouter } from '@tanstack/react-query';

import LeaderCard from './LeaderCard';

const leaders = [
	{
		name: "Prof. Kwame Mensah",
		role: "President",
		bio: "Leading expert in West African linguistics with over 20 years of research experience.",
		imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
	},
	{
		name: "Dr. Abena Osei",
		role: "Vice President",
		bio: "Specializes in phonology and language documentation of Gur languages.",
		imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
	},
	{
		name: "Dr. Yaw Addo",
		role: "Secretary",
		bio: "Expert in computational linguistics and language technology.",
		imageUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80"
	}
];

export default function LeadershipPage() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
		  try {
			const response = await axios.get("http://127.0.0.1:8000/api/leadership/");
			setData(response.data);
			// console.log(response)
		  } catch (error) {
			console.error("Error fetching data:", error);
			setData([]);
		  }
		};
	
		fetchData();
	  }, []);

	return (
		<div className="py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-xl font-bold text-gray-700">Our Leadership</h1>
					<p className="mt-4 text-xl text-gray-600">
						Meet the dedicated team guiding our association
					</p>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{data.map((leader) => (
						console.log(leader),
						<LeaderCard key={leader.name} {...leader} />
					))}
				</div>
			</div>
		</div>
	);
}