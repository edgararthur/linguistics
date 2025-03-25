# Membership Page Setup

This document provides instructions on how to set up and connect a Google Form to the Membership page.

## Google Forms Setup

1. **Create a Google Form with the following fields:**
   - Name (Text)
   - Email (Text)
   - Profession (Text)
   - Specialization (Text)
   - Institution (Text)
   - Bio (Paragraph)
   - Profile Image URL (Text) - Optional, as the app will generate an avatar if none is provided

2. **Connect to a Google Sheet:**
   - In the Google Form, click on "Responses" tab
   - Click the Google Sheets icon
   - Select "Create a new spreadsheet" or connect to an existing one
   - The form responses will now be collected in this Google Sheet

3. **Publish the Google Sheet:**
   - Open the Google Sheet that's connected to your form
   - Go to File > Share > Publish to the web
   - Choose "Entire Document" and select "Sheet1"
   - Click "Publish"
   - Copy the published URL (or just the Sheet ID)

## Connecting to the Application

1. **Update the Sheet ID:**
   - Open `src/components/membership/MembershipPage.tsx`
   - Find the line with `const sheetId = 'YOUR_SHEET_ID';`
   - Replace 'YOUR_SHEET_ID' with your actual Google Sheet ID
   - The Sheet ID is the long string in the Sheet URL between `/d/` and `/edit`
   - Example: `https://docs.google.com/spreadsheets/d/`**`1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V`**`/edit`

2. **Check Column Mapping:**
   - Ensure the column mapping in `googleFormsUtils.ts` matches your Google Sheet structure
   - The default mapping assumes:
     - Column 0: Name
     - Column 1: Email
     - Column 2: Profession
     - Column 3: Specialization
     - Column 4: Institution
     - Column 5: Bio
     - Column 6: Image URL (optional)
   - If your columns are different, update the mapping in `fetchMembersFromGoogleForms` function

## Avatar Generation

The application uses the free UI Avatars API (https://ui-avatars.com) to generate avatars for members who don't provide an image URL:

1. **How it works:**
   - If a member doesn't provide an image URL, an avatar is automatically generated based on their name
   - The avatar displays the member's initials on a colored background
   - The background color is randomly assigned for diversity

2. **Customizing avatars:**
   - The URL format is: `https://ui-avatars.com/api/?name=John+Doe&background=random&size=128`
   - You can customize the following parameters:
     - `name`: The name to generate initials from (spaces are replaced with '+')
     - `background`: Color of the background (hex code without #, or 'random')
     - `color`: Text color (hex code without #)
     - `size`: Image size in pixels

3. **Alternatives:**
   - If you prefer a different avatar service, update the `fallbackAvatar` variable in `googleFormsUtils.ts`
   - Other free options include Gravatar (if you collect email addresses) or DiceBear Avatars

## CORS Considerations

If you encounter CORS issues, consider:

1. **Using a proxy server** to make the request
2. **Creating a simple backend API** that fetches the data and exposes it to your frontend
3. **Using Google Sheets API** with proper authentication instead of the published sheet

## Testing

For development and testing, the application will display mock data if the API connection fails.

## Production Considerations

For a production environment:

1. **Set up error handling** and proper logging
2. **Implement caching** to reduce API calls
3. **Add pagination** if the number of members grows large
4. **Add server-side filtering** to improve search performance
5. **Set up proper authentication** for the Google Sheets API 