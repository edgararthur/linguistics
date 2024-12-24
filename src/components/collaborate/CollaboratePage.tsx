import React from 'react';
import { Handshake, Building, GraduationCap, Globe } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

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
	return (
		<div className="py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900">Collaborate With Us</h1>
					<p className="mt-4 text-xl text-gray-600">
						Join us in advancing linguistic research and preservation
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
					{collaborationTypes.map((type) => (
						<Card key={type.title}>
							<div className="text-center">
								<type.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{type.title}
								</h3>
								<p className="text-gray-600 mb-4">{type.description}</p>
								<Button variant="outline" size="sm">Learn More</Button>
							</div>
						</Card>
					))}
				</div>

				<Card className="text-center p-8">
					<Handshake className="h-16 w-16 text-blue-600 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Start a Collaboration
					</h2>
					<p className="text-gray-600 mb-6 max-w-2xl mx-auto">
						Interested in collaborating with us? Fill out our collaboration inquiry
						form, and we'll get back to you to discuss potential opportunities.
					</p>
					<Button size="lg">Contact Us</Button>
				</Card>
			</div>
		</div>
	);
}