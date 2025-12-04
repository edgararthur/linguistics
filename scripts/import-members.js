
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY in .env file');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQY3oj6VAFrPTAVTOK1c6lOfHcmFSeSq4qLOSCbILyuO4w_pX7A-lWRSUheOEYRi49Vh99LP64vezyr/pub?output=csv';

async function importMembers() {
    try {
        console.log('Fetching CSV data...');
        const response = await fetch(CSV_URL);
        const csvText = await response.text();

        console.log('Parsing CSV...');
        const { data, errors } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (errors.length > 0) {
            console.warn('CSV Parsing Errors:', errors);
        }

        console.log(`Found ${data.length} records. Processing...`);

        let successCount = 0;
        let errorCount = 0;

        for (const row of data) {
            // Map CSV columns to database fields
            // CSV Headers:
            // Timestamp, Email Address, SURNAME / LAST NAME, FIRST NAME, OTHER NAME(S),
            // PRIMARY EMAIL CONTACT, ALTERNATIVE EMAIL CONTACT, PHONE CONTACT ...,
            // Do you wish to be added to the LAG WhatsApp group..., COUNTRY OF CURRENT RESIDENCE,
            // HIGHEST EDUCATIONAL QUALIFICATION, AREA OF RESEARCH INTEREST / SPECIALISATION,
            // INSTITUTIONAL AFFILIATION, Link (url) to your professional webpage...,
            // When (in terms of YEAR) did you join LAG?, MEMBERSHIP CATEGORIES...,
            // Dues 2025, Dues 2026, ...

            const email = row['Email Address']?.trim() || row['PRIMARY EMAIL CONTACT']?.trim();
            if (!email) {
                console.warn('Skipping row without email:', row);
                errorCount++;
                continue;
            }

            const memberData = {
                email: email,
                first_name: row['FIRST NAME']?.trim(),
                last_name: row['SURNAME / LAST NAME']?.trim(),
                other_names: row['OTHER NAME(S)']?.trim(),
                alternative_email: row['ALTERNATIVE EMAIL CONTACT']?.trim(),
                phone: row['PHONE CONTACT (Please include country code if it\'s a non-Ghana number.) ']?.trim(),
                whatsapp_consent: row['Do you wish to be added to the LAG WhatsApp group: "LAG RESEARCH PLATFORM"?\nNB: A "Yes" response requires that you provide a WhatsAppable phone contact above.']?.toLowerCase().startsWith('yes'),
                country: row['COUNTRY OF CURRENT RESIDENCE']?.trim(),
                qualification: row['HIGHEST EDUCATIONAL QUALIFICATION']?.trim(),
                research_area: row['AREA OF RESEARCH INTEREST / SPECIALISATION']?.trim(),
                affiliation: row['INSTITUTIONAL AFFILIATION ']?.trim(), // Note the space at the end if present in CSV header
                profile_url: row['Link (url) to your professional webpage, if any (Please copy and paste.)']?.trim(),
                joined_year: row['When (in terms of YEAR) did you join LAG?']?.trim(),
                membership_type: parseMembershipType(row['MEMBERSHIP CATEGORIES - [APPLICABLE ANNUAL DUES]\nKindly note the following: \n\n1. If you are a Faculty/Researcher in a tertiary/research institution, your membership is designated as REGULAR. This doesn\'t matter whether you are still in school or not.\n\n2. Payment Details\n\na. (Ghana) Mobile Money Transfer\n\nRecipient Name: Linguistics Association of Ghana\nAccount Number: 0244297775\n\nNB: Please use your LAG-recognisable name [as indicated on your application form] as Reference.\n\nb. (Ghana) Bank Transfer\n\nName of Bank: GCB Bank Ltd.\n\nAccount number: 1361130002333\n\nBranch: Kisseiman\n\nAccount name: Linguistics Association of Ghana\n\nNB: Please complete the payee portion with your LAG-recognisable name.\n\n c. (International) Bank Transfer\nBank: GCB Bank Ltd.\nAccount name: Linguistics Association of Ghana\nAccount number: 1361130002333\nSWIFT Code: GHCBGHAC\n\nNB: Please complete the payee portion with your LAG-recognisable details.']),
                status: 'active', // Default to active for imported members
                dues_paid_until: calculateDuesPaidUntil(row),
                // created_at: row['Timestamp'] ? new Date(row['Timestamp']).toISOString() : new Date().toISOString(), // Let Supabase handle created_at or update if needed
            };

            // Upsert member based on email
            const { error } = await supabase
                .from('members')
                .upsert(memberData, { onConflict: 'email' });

            if (error) {
                console.error(`Error importing ${email}:`, error.message);
                errorCount++;
            } else {
                // console.log(`Imported ${email}`);
                successCount++;
            }
        }

        console.log(`Import completed. Success: ${successCount}, Failed: ${errorCount}`);

    } catch (error) {
        console.error('Import failed:', error);
    }
}

function parseMembershipType(rawType) {
    if (!rawType) return 'Regular';
    if (rawType.toLowerCase().includes('student')) return 'Student';
    if (rawType.toLowerCase().includes('regular')) return 'Regular';
    return 'Regular'; // Default
}

function calculateDuesPaidUntil(row) {
    // Check Dues columns
    const years = ['2029', '2028', '2027', '2026', '2025'];
    for (const year of years) {
        if (row[`Dues ${year}`]) {
            return `${year}-12-31`;
        }
    }
    return null;
}

importMembers();
