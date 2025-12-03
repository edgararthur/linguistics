import React, { useEffect, useRef } from 'react';
import { Handshake, Building, GraduationCap, Globe } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import gsap from '../../utils/gsapConfig';

const collaborationTypes = [
	{
		icon: Building,
		title: "Institutional Partnerships",
		description: "Partner with us for joint research projects, student exchanges, and academic collaborations."
	},
	{
		icon: GraduationCap,
		title: "Research Collaboration",
		description: "Join our research initiatives in language documentation, sociolinguistics, and more."
	},
	{
		icon: Globe,
		title: "Community Projects",
		description: "Participate in our community-based language preservation and education programs."
	}
];

export default function CollaboratePage() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.from('.collab-card', {
				y: 50,
				opacity: 0,
				duration: 0.8,
				stagger: 0.2,
				scrollTrigger: {
					trigger: containerRef.current,
					start: 'top 80%',
				},
			});

			gsap.from('.cta-card', {
				scale: 0.9,
				opacity: 0,
				duration: 0.8,
				delay: 0.4,
				scrollTrigger: {
					trigger: '.cta-card',
					start: 'top 85%',
				},
			});
		});
		return () => ctx.revert();
	}, []);

	return (
		<div className="py-12 bg-gray-50 min-h-screen">
			<div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-5xl font-bold text-gray-900 interactive">Collaborate With Us</h1>
					<p className="mt-4 text-xl text-gray-600">
						Join us in advancing linguistic research and preservation
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					{collaborationTypes.map((type) => (
						<div key={type.title} className="collab-card h-full">
							<Card className="text-center h-full group hover:bg-yellow-50 transition-all duration-300" interactive>
								<div className="p-6 flex flex-col items-center h-full">
									<div className="p-4 bg-yellow-100 rounded-full mb-6 group-hover:bg-yellow-500 transition-colors duration-300">
										<type.icon className="h-8 w-8 text-yellow-600 group-hover:text-white" />
									</div>
									<h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-yellow-700 transition-colors">
										{type.title}
									</h3>
									<p className="text-gray-600 mb-6 flex-grow">{type.description}</p>
									<Button variant="outline" size="sm" className="interactive hover:bg-yellow-500 hover:text-white hover:border-transparent">Learn More</Button>
								</div>
							</Card>
						</div>
					))}
				</div>

				<div className="cta-card">
					<Card className="text-center p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300" interactive>
						<Handshake className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
						<h2 className="text-3xl font-bold text-gray-900 mb-6">
							Start a Collaboration
						</h2>
						<p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
							Interested in collaborating with us? Fill out our collaboration inquiry
							form, and we'll get back to you to discuss potential opportunities.
						</p>
						<Button size="lg" className="bg-yellow-500 text-black font-bold hover:bg-yellow-400 transform hover:scale-105 transition-all interactive">Contact Us</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}