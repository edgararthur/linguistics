import React, { useEffect, useRef } from 'react';
import gsap from '../../utils/gsapConfig';

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
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from('.leader-card-wrapper', {
				y: 50,
				opacity: 0,
				duration: 0.8,
				stagger: 0.2,
				scrollTrigger: {
					trigger: containerRef.current,
					start: 'top 80%',
				},
			});
		});
		return () => ctx.revert();
	}, []);

	return (
		<div className="py-12 bg-gray-50">
			<div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 interactive">Our Leadership</h1>
					<p className="mt-4 text-xl text-gray-600">
						Meet the dedicated team guiding our association
					</p>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{leaders.map((leader) => (
						<div key={leader.name} className="leader-card-wrapper interactive">
							<LeaderCard position={leader.role} description={leader.bio} image={leader.imageUrl} name={leader.name} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
