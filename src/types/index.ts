export interface Member {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    alternative_email?: string;
    phone?: string;
    affiliation: string;
    research_area?: string;
    membership_type: string;
    status: 'active' | 'pending' | 'expired';
    dues_paid_until?: string | null;
    image_url?: string | null;
    profile_url?: string | null;
    country?: string;
    qualification?: string;
    whatsapp_consent?: boolean;
    joined_year?: string;
    other_names?: string;
    created_at: string;
}

export interface Leader {
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url: string | null;
    term_start?: string;
    term_end?: string;
    is_current: boolean;
    display_order: number;
    created_at?: string;
}
