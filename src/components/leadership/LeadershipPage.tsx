import { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery, useRouter } from '@tanstack/react-query';

import LeaderCard from './LeaderCard';

import ProfJosesphine from '../../assets/leadership/Prof. Josephine.jpeg'
import ProfRamos from '../../assets/leadership/Dr Ramos.jpeg'
import DrKorsah from '../../assets/leadership/Dr. Korsah.jpeg'
import DrDorothy from '../../assets/leadership/Dr. Dorothy Pokua Agyepong.jpeg'
import MsAlberta from '../../assets/leadership/Ms. Alberta Dansoah.jpeg'
import DrRescue from '../../assets/leadership/Dr. Rescue.jpeg'

const leaders = [
	{
		name: "Prof. Josephine Dzahene-Quarshie",
		role: "President",
		bio: "Leading expert in West African linguistics with over 20 years of research experience.",
		imageUrl: ProfJosesphine
	},
	{
		name: "Prof. Ramos Asafo-Adjei",
		role: "Vice President",
		bio: "Expert in computational linguistics and language technology.",
		imageUrl: ProfRamos
	},
	{
		name: "Dr. Sampson Korsah",
		role: "Secretary",
		bio: "Specializes in phonology and language documentation of Gur languages.",
		imageUrl: DrKorsah
	},
	{
		name: "Dr. Dorothy Pokua",
		role: "Organizing Secretary",
		bio: "Expert in computational linguistics and language technology.",
		imageUrl: DrDorothy
	},
	{
		name: "Ms. Alberta Dansoah Nyarko Ansah",
		role: "Treasurer",
		bio: "Expert in computational linguistics and language technology.",
		imageUrl: MsAlberta
	},
	{
		name: "Dr. Elvis Rescue",
		role: "Co-Editor, GJL",
		bio: "Expert in computational linguistics and language technology.",
		imageUrl: DrRescue
	},
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
					{leaders.map((leader) => (
						console.log(leader),
						<LeaderCard position={leader.role} description={leader.bio} image={leader.imageUrl} key={leader.name} {...leader} />
					))}
				</div>
			</div>
		</div>
	);
}
