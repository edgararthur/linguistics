import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import image2 from '../assets/LAG_2023.jpg'

const slides = [
	{
		image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80',
		title: 'Advancing Linguistic Research',
		description: 'Join us in exploring the diverse languages of Ghana'
	},
	{
		image: image2,
		title: '15th LAG Conference 2023',
		description: 'Rethinking Language and Linguistics Research for Sustainable Development in the 21st Century'
	},
	{
		image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80',
		title: 'Publications & Research',
		description: 'Discover our latest linguistic publications'
	}
];

export default function Carousel() {
	const [currentSlide, setCurrentSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	return (
		<div className="relative h-[600px] w-full overflow-hidden">
			{slides.map((slide, index) => (
				<div
					key={index}
					className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
						index === currentSlide ? 'opacity-100' : 'opacity-0'
					}`}
				>
					<img
						src={slide.image}
						alt={slide.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black bg-opacity-40" />
					<div className="absolute inset-0 flex flex-col items-center justify-center text-white">
						<h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
						<p className="text-xl md:text-2xl">{slide.description}</p>
					</div>
				</div>
			))}
			
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
			>
				<ChevronLeft className="h-6 w-6 text-gray-800" />
			</button>
			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
			>
				<ChevronRight className="h-6 w-6 text-gray-800" />
			</button>
		</div>
	);
}