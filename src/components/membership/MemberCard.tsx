import React from 'react';
import { Member } from './googleFormsUtils';

interface MemberCardProps {
	member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
	return (
		<div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
			<div className="flex items-center space-x-3">
				<img
					src={member.imageUrl}
					alt={`${member.firstName} ${member.lastName}`}
					className="w-12 h-12 rounded-full border-2 border-gray-200"
				/>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-gray-900 truncate">
						{member.firstName} {member.lastName}
					</h3>
					<p className="text-xs text-gray-600 truncate">{member.affiliation}</p>
				</div>
			</div>
			<div className="mt-2">
				<p className="text-xs text-gray-600 line-clamp-1">{member.researchArea}</p>
				{member.profileUrl && (
					<a
						href={member.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
					>
						View Profile →
					</a>
				)}
			</div>
		</div>
	);
};

export default MemberCard; 