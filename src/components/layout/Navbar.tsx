import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import imageUrl from "../../assets/logo.png"

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const location = useLocation();
	const isHomePage = location.pathname === '/';

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Leadership', href: '/leadership' },
		{ name: 'Publications', href: '/publications' },
		{ name: 'Events', href: '/events' },
		{ name: 'Members', href: '/membership' },
		{ name: 'Collaborate', href: '/collaborate' },
		{ name: 'Join Us', href: '/join' },
	];

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const navBackgroundClass = isHomePage && !isScrolled
		? 'bg-transparent shadow-none'
		: 'bg-white shadow-lg';

	const textColorClass = isHomePage && !isScrolled
		? 'text-white hover:text-yellow-400'
		: 'text-gray-500 hover:text-blue-500';

	const activeTextColorClass = isHomePage && !isScrolled
		? 'text-yellow-400'
		: 'text-blue-500';

	const logoTextClass = isHomePage && !isScrolled
		? 'text-white'
		: 'text-gray-600';

	const mobileMenuButtonClass = isHomePage && !isScrolled
		? 'text-white hover:text-yellow-400'
		: 'text-gray-700 hover:text-blue-600';

	return (
		<nav className={`${navBackgroundClass} fixed w-full z-50 transition-all duration-300`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<img
								src={imageUrl}
								alt="lag-logo"
								className="w-12 h-12 rounded-full object-cover"
							/>
							<span className={`ml-2 text-sm font-medium transition-colors ${logoTextClass}`}>
								Linguistics Association of Ghana
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`px-3 py-2 rounded-md text-xs font-normal transition-colors ${isActive(item.href)
									? activeTextColorClass
									: textColorClass
									}`}
							>
								{item.name}
							</Link>
						))}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className={`transition-colors ${mobileMenuButtonClass}`}
						>
							{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden bg-white shadow-lg">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`block px-3 py-2 rounded-md text-xs font-medium ${isActive(item.href)
									? 'text-blue-600 bg-blue-50'
									: 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
									}`}
								onClick={() => setIsMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
