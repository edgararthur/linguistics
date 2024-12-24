import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import imageUrl from "../../assets/logo.png"

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Leadership', href: '/leadership' },
		{ name: 'Publications', href: '/publications' },
		{ name: 'Events', href: '/events' },
		{ name: 'Collaborate', href: '/collaborate' },
		{ name: 'Join Us', href: '/join' },
	];

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	return (
		<nav className="bg-white shadow-lg fixed w-full z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<img
								src={imageUrl}
								alt="lag-logo"
								className="w-12 h-12 rounded-full object-cover"
							/>
							<span className="ml-2 text-lg font-medium text-gray-600">Linguistics Association of Ghana</span>
						</Link>
					</div>
					
					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`px-3 py-2 rounded-md text-sm font-normal transition-colors ${
									isActive(item.href)
										? 'text-blue-500'
										: 'text-gray-500 hover:text-blue-500'
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
							className="text-gray-700 hover:text-blue-600"
						>
							{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isMenuOpen && (
				<div className="md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						{navItems.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`block px-3 py-2 rounded-md text-base font-medium ${
									isActive(item.href)
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