import axios from 'axios';

export interface Member {
  id: string;
  name: string;
  email: string;
  profession: string;
  specialization: string;
  institution: string;
  bio: string;
  imageUrl: string;
}

/**
 * Fetches member data from a Google Sheets spreadsheet connected to a Google Form
 * @param sheetId - The ID of the Google Sheet
 * @returns Promise with an array of Member objects
 */
export async function fetchMembersFromGoogleForms(sheetId: string): Promise<Member[]> {
  try {
    // Create the Google Sheets API URL with the appropriate format
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    
    // Fetch the data
    const response = await axios.get(sheetUrl);
    
    // Process the response data
    // Google Sheets API returns a string that needs to be cleaned and parsed
    const responseData = response.data.toString();
    const jsonData = JSON.parse(responseData.substring(47).slice(0, -2));
    
    // The first row contains headers, so we start from the second row
    if (!jsonData || !jsonData.table || !jsonData.table.rows) {
      throw new Error('Invalid data format from Google Sheets');
    }
    
    // Map the data to our Member interface
    const membersData = jsonData.table.rows.map((row: any, index: number) => {
      if (!row.c) return null;
      
      const cells = row.c;
      // Generate a fallback avatar if no image URL is provided
      const name = cells[0]?.v || 'Unknown';
      const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;
      
      return {
        id: index.toString(),
        name,
        email: cells[1]?.v || '',
        profession: cells[2]?.v || 'Not specified',
        specialization: cells[3]?.v || 'Not specified',
        institution: cells[4]?.v || 'Not specified',
        bio: cells[5]?.v || 'No bio provided',
        imageUrl: cells[6]?.v || fallbackAvatar,
      };
    }).filter(Boolean);
    
    return membersData;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}

/**
 * Provides mock member data for development or when API fails
 * @returns Array of Member objects
 */
export function getMockMembers(): Member[] {
  return [
    {
      id: '1',
      name: 'Dr. Kofi Mensah',
      email: 'kofi.mensah@university.edu',
      profession: 'Lecturer',
      specialization: 'Phonology',
      institution: 'University of Ghana',
      bio: 'Specializes in West African phonological systems with over 10 years of research experience.',
      imageUrl: 'https://ui-avatars.com/api/?name=Kofi+Mensah&background=0D8ABC&color=fff',
    },
    {
      id: '2',
      name: 'Dr. Ama Aidoo',
      email: 'ama.aidoo@research.org',
      profession: 'Researcher',
      specialization: 'Syntax',
      institution: 'African Linguistics Research Center',
      bio: 'Expert in Akan syntax with publications in major linguistics journals.',
      imageUrl: 'https://ui-avatars.com/api/?name=Ama+Aidoo&background=C70039&color=fff',
    },
    {
      id: '3',
      name: 'Prof. Kwame Owusu',
      email: 'k.owusu@education.gov',
      profession: 'Professor',
      specialization: 'Sociolinguistics',
      institution: 'Ministry of Education',
      bio: 'Works on language policy and planning for Ghana\'s educational system.',
      imageUrl: 'https://ui-avatars.com/api/?name=Kwame+Owusu&background=138D75&color=fff',
    },
    {
      id: '4',
      name: 'Dr. Efua Dadzie',
      email: 'efua.dadzie@linguistics.org',
      profession: 'Independent Researcher',
      specialization: 'Language Documentation',
      institution: 'Ghana Linguistics Society',
      bio: 'Documents endangered languages in Northern Ghana.',
      imageUrl: 'https://ui-avatars.com/api/?name=Efua+Dadzie&background=7D3C98&color=fff',
    },
    {
      id: '5',
      name: 'Mr. Yaw Boateng',
      email: 'yaw.boateng@student.edu',
      profession: 'PhD Candidate',
      specialization: 'Cognitive Linguistics',
      institution: 'University of Cape Coast',
      bio: 'Researching metaphor and cognition in Ghanaian languages.',
      imageUrl: 'https://ui-avatars.com/api/?name=Yaw+Boateng&background=F39C12&color=fff',
    },
    {
      id: '6',
      name: 'Ms. Abena Osei',
      email: 'abena.osei@translator.com',
      profession: 'Translator',
      specialization: 'Translation Studies',
      institution: 'Ghana Translation Services',
      bio: 'Professional translator specializing in Twi-English translation.',
      imageUrl: 'https://ui-avatars.com/api/?name=Abena+Osei&background=2E4053&color=fff',
    },
    {
      id: '6',
      name: 'Ms. Abena Osei',
      email: 'abena.osei@translator.com',
      profession: 'Translator',
      specialization: 'Translation Studies',
      institution: 'Ghana Translation Services',
      bio: 'Professional translator specializing in Twi-English translation.',
      imageUrl: 'https://ui-avatars.com/api/?name=Abena+Osei&background=2E4053&color=fff',
    },
    {
      id: '6',
      name: 'Ms. Abena Osei',
      email: 'abena.osei@translator.com',
      profession: 'Translator',
      specialization: 'Translation Studies',
      institution: 'Ghana Translation Services',
      bio: 'Professional translator specializing in Twi-English translation.',
      imageUrl: 'https://ui-avatars.com/api/?name=Abena+Osei&background=2E4053&color=fff',
    },
    {
      id: '6',
      name: 'Ms. Abena Osei',
      email: 'abena.osei@translator.com',
      profession: 'Translator',
      specialization: 'Translation Studies',
      institution: 'Ghana Translation Services',
      bio: 'Professional translator specializing in Twi-English translation.',
      imageUrl: 'https://ui-avatars.com/api/?name=Abena+Osei&background=2E4053&color=fff',
    },
    {
      id: '6',
      name: 'Ms. Abena Osei',
      email: 'abena.osei@translator.com',
      profession: 'Translator',
      specialization: 'Translation Studies',
      institution: 'Ghana Translation Services',
      bio: 'Professional translator specializing in Twi-English translation.',
      imageUrl: 'https://ui-avatars.com/api/?name=Abena+Osei&background=2E4053&color=fff',
    },
  ];
} 