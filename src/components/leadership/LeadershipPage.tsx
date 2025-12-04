import React, { useEffect, useRef, useState } from 'react';
import gsap from '../../utils/gsapConfig';
import { leadershipService } from '../../services/leadershipService';
import { Leader } from '../../types';
import LeaderCard from './LeaderCard';
import { Loader, AlertCircle } from 'lucide-react';

export default function LeadershipPage() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [leaders, setLeaders] = useState<Leader[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadLeaders();
	}, []);

	useEffect(() => {
		if (!loading && leaders.length > 0 && containerRef.current) {
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
			}, containerRef);
			return () => ctx.revert();
		}
	}, [loading, leaders]);

	const loadLeaders = async () => {
		try {
			setLoading(true);
			const { data } = await leadershipService.getLeaders(1, 100); // Fetch all leaders
			setLeaders(data);
		} catch (err) {
			console.error('Error loading leaders:', err);
			setError('Failed to load leadership team.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="py-12 bg-gray-50 min-h-screen">
			<div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 interactive">Our Leadership</h1>
					<p className="mt-4 text-xl text-gray-600">
						Meet the dedicated team guiding our association
					</p>
				</div>

				{error && (
					<div className="max-w-2xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
						<AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
						<p className="text-red-700">{error}</p>
					</div>
				)}

				{loading ? (
					<div className="flex justify-center items-center py-20">
						<Loader className="w-12 h-12 text-blue-900 animate-spin" />
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{leaders.length > 0 ? (
							leaders.map((leader) => (
								<div key={leader.id} className="leader-card-wrapper interactive">
									<LeaderCard
										position={leader.role}
										description={leader.bio}
										image={leader.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
										name={leader.name}
									/>
								</div>
							))
						) : (
							<div className="col-span-full text-center py-10 text-gray-500">
								No leadership members found.
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
