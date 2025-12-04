import axios from 'axios';

export interface Member {
	id: string;
	firstName: string;
	lastName: string;
	affiliation: string;
	researchArea: string;
	profileUrl?: string; // Optional since not all members might have a profile
	imageUrl: string;
}

/**
 * Fetches member data from the published Google Sheet in CSV format
 * @param sheetId - The ID of the Google Sheet
 * @returns Promise with an array of Member objects
 */
export async function fetchMembersFromGoogleForms(sheetId: string): Promise<Member[]> {
	try {
		// Direct access to the published sheet without authentication
		// Using the published URL format with CSV output
		const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQY3oj6VAFrPTAVTOK1c6lOfHcmFSeSq4qLOSCbILyuO4w_pX7A-lWRSUheOEYRi49Vh99LP64vezyr/pub?output=csv';
		
		console.log('Fetching data from:', url);
		
		// Use axios to fetch the CSV data
		const response = await axios.get(url, {
			// Add headers to avoid CORS issues
			headers: {
				'Accept': 'text/csv;charset=utf-8',
			},
		});
		
		// Log the response headers to debug
		console.log('Response headers:', response.headers);
		console.log('Response type:', typeof response.data);
		console.log('Response preview:', typeof response.data === 'string' ? response.data.substring(0, 200) : 'Not a string');
		
		// Parse the CSV data
		const csvData = response.data;
		const rows = csvData.split('\n').map((row: string) => 
			row.split(',').map((cell: string) => cell.trim().replace(/^"(.*)"$/, '$1'))
		);
		
		console.log('CSV rows:', rows.length);
		if (rows.length > 0) {
			console.log('Headers:', rows[0]);
		}
		
		// Skip the header row and process the data
		const membersData = rows.slice(1).map((row: string[], index: number) => {
			if (!row || row.length < 3) return null;
			
			// Map CSV columns to member properties
			// Based on the LAG spreadsheet structure in the Google Form
			const lastName = row[2] || ''; // "SURNAME / LAST NAME" column
			const firstName = row[3] || ''; // "FIRST NAME" column
			const affiliation = row[12] || 'Not specified'; // "INSTITUTIONAL AFFILIATION" column
			const researchArea = row[11] || 'Not specified'; // "AREA OF RESEARCH INTEREST / SPECIALISATION" column
			const profileUrl = row[13] || undefined; // URL column
			
			// Generate avatar URL
			const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
			const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&size=128`;
			
			return {
				id: index.toString(),
				firstName,
				lastName,
				affiliation,
				researchArea,
				profileUrl,
				imageUrl: avatarUrl,
			};
		}).filter(Boolean); // Remove null values
		
		console.log('Parsed members:', membersData.length);
		return membersData;
	} catch (error) {
		console.error('Error fetching data from Google Sheets:', error);
		
		// If all else fails, use the extracted data as a fallback
		console.warn('Using extracted data as fallback');
		return getLagMembers();
	}
}

/**
 * Fallback data from the LAG spreadsheet
 * Only used if the direct fetch fails
 */
export function getLagMembers(): Member[] {
	// Based on the data we've seen in the spreadsheet
	return [
		{
			id: '1',
			firstName: 'Ramos',
			lastName: 'Asafo-Adjei',
			affiliation: 'Takoradi Technical University',
			researchArea: 'Discourse analysis, language assessment, pragmatics, socio linguistics',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Ramos+Asafo-Adjei&background=0D8ABC&color=fff',
		},
		{
			id: '2',
			firstName: 'Dorothy',
			lastName: 'Agyepong',
			affiliation: 'University of Ghana',
			researchArea: 'Semantics and Pragmatics',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Dorothy+Agyepong&background=C70039&color=fff',
		},
		{
			id: '3',
			firstName: 'Josephine',
			lastName: 'Dzahene-Quarshie',
			affiliation: 'University of Ghana',
			researchArea: 'Syntax, Sociolinguistics, Pragmatics, Discourse analysis',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Josephine+Dzahene-Quarshie&background=138D75&color=fff',
		},
		{
			id: '4',
			firstName: 'George',
			lastName: 'Frimpong',
			affiliation: 'University of Ghana',
			researchArea: 'Grammar, systemic functional grammar, registers, chorus linguistics, grammatical models for language analysis',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=George+Frimpong&background=7D3C98&color=fff',
		},
		{
			id: '5',
			firstName: 'Lydia',
			lastName: 'Ghunney',
			affiliation: 'University of Education, Winneba',
			researchArea: 'Linguistics',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Lydia+Ghunney&background=F39C12&color=fff',
		},
		{
			id: '6',
			firstName: 'Hamza',
			lastName: 'Ayimbisa',
			affiliation: 'UEW',
			researchArea: 'Semantics/Morphology',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Hamza+Ayimbisa&background=2E4053&color=fff',
		},
		{
			id: '7',
			firstName: 'Faustina',
			lastName: 'Taylor',
			affiliation: 'University of Education, Winneba',
			researchArea: 'Linguistics',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Faustina+Taylor&background=884EA0&color=fff',
		},
		{
			id: '8',
			firstName: 'Justice',
			lastName: 'Quainoo',
			affiliation: 'University of Ghana',
			researchArea: 'Discourse analysis, corpus linguistics, stylistics, English and communicaty',
			profileUrl: undefined,
			imageUrl: 'https://ui-avatars.com/api/?name=Justice+Quainoo&background=D35400&color=fff',
		}
	];
}

/**
 * Provides mock member data for development or when API fails
 * @returns Array of Member objects
 */
export function getMockMembers(): Member[] {
	return [
		{
			id: '1',
			firstName: 'Ramos',
			lastName: 'Asafo-Adjei',
			affiliation: 'Takoradi Technical University',
			researchArea: 'Discourse analysis, language assessment, pragmatics, socio linguistics',
			profileUrl: 'https://www.ttu.edu.gh/staff/ramos-asafo-adjei',
			imageUrl: 'https://ui-avatars.com/api/?name=Ramos+Asafo-Adjei&background=0D8ABC&color=fff',
		},
		{
			id: '2',
			firstName: 'Dorothy',
			lastName: 'Agyepong',
			affiliation: 'University of Ghana',
			researchArea: 'Semantics and Pragmatics',
			profileUrl: 'https://www.ug.edu.gh/staff/dorothy-agyepong',
			imageUrl: 'https://ui-avatars.com/api/?name=Dorothy+Agyepong&background=C70039&color=fff',
		},
		{
			id: '3',
			firstName: 'Josephine',
			lastName: 'Dzahene-Quarshie',
			affiliation: 'University of Ghana',
			researchArea: 'Syntax, Sociolinguistics, Pragmatics, Discourse analysis',
			profileUrl: 'https://www.ug.edu.gh/staff/josephine-dzahene-quarshie',
			imageUrl: 'https://ui-avatars.com/api/?name=Josephine+Dzahene-Quarshie&background=138D75&color=fff',
		},
		{
			id: '4',
			firstName: 'Kwesi',
			lastName: 'Prah',
			affiliation: 'University of Cape Coast',
			researchArea: 'Historical linguistics, dialectology, language documentation',
			profileUrl: 'https://www.ucc.edu.gh/staff/kwesi-prah',
			imageUrl: 'https://ui-avatars.com/api/?name=Kwesi+Prah&background=7D3C98&color=fff',
		},
		{
			id: '5',
			firstName: 'Akosua',
			lastName: 'Amoo',
			affiliation: 'Ghana Institute of Languages',
			researchArea: 'Translation studies, lexicography, language acquisition',
			imageUrl: 'https://ui-avatars.com/api/?name=Akosua+Amoo&background=F39C12&color=fff',
		},
		{
			id: '6',
			firstName: 'Emmanuel',
			lastName: 'Ofori',
			affiliation: 'Kwame Nkrumah University of Science and Technology',
			researchArea: 'Computational linguistics, corpus studies, language technology',
			profileUrl: 'https://www.knust.edu.gh/staff/emmanuel-ofori',
			imageUrl: 'https://ui-avatars.com/api/?name=Emmanuel+Ofori&background=2E4053&color=fff',
		},
		{
			id: '7',
			firstName: 'Grace',
			lastName: 'Mensah',
			affiliation: 'Ghana Communication Technology University',
			researchArea: 'Language and technology, digital linguistics, NLP applications',
			profileUrl: 'https://gctu.edu.gh/staff/grace-mensah',
			imageUrl: 'https://ui-avatars.com/api/?name=Grace+Mensah&background=884EA0&color=fff',
		},
		{
			id: '8',
			firstName: 'Kofi',
			lastName: 'Bentil',
			affiliation: 'University of Education, Winneba',
			researchArea: 'Language pedagogy, educational linguistics, curriculum development',
			imageUrl: 'https://ui-avatars.com/api/?name=Kofi+Bentil&background=D35400&color=fff',
		},
		{
			id: '9',
			firstName: 'Abena',
			lastName: 'Yeboah',
			affiliation: 'Ministry of Education',
			researchArea: 'Language policy, mother tongue education, literacy development',
			profileUrl: 'https://moe.gov.gh/staff/abena-yeboah',
			imageUrl: 'https://ui-avatars.com/api/?name=Abena+Yeboah&background=1ABC9C&color=fff',
		},
		{
			id: '10',
			firstName: 'Kwame',
			lastName: 'Ansah',
			affiliation: 'African Academy of Languages',
			researchArea: 'African linguistics, language revitalization, endangered languages',
			profileUrl: 'https://acalan.org/staff/kwame-ansah',
			imageUrl: 'https://ui-avatars.com/api/?name=Kwame+Ansah&background=E74C3C&color=fff',
		}
	];
} 