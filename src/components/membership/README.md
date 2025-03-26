# LAG Membership Page

This component displays information about members of the Linguistics Association of Ghana (LAG).

## Implementation Approach

The membership page attempts to fetch data directly from the published Google Sheet, with fallback options for reliability:

### Primary Method: Direct CSV Access

1. The component first attempts to access the published Google Sheet in CSV format
2. It uses the direct URL: `https://docs.google.com/spreadsheets/d/e/SHEET_ID/pub?output=csv`
3. The CSV data is parsed and mapped to member objects

### Fallback Method: Extracted Data

If the direct fetch fails (often due to CORS restrictions):
1. The system falls back to using pre-extracted member data
2. This data was directly copied from the LAG spreadsheet
3. A notification appears indicating fallback data is being used

### Sample Data Option

The component also includes a sample data option with fictional members for demonstration purposes.

## Data Structure

Each member record includes:
- First Name
- Last Name (Surname)
- Institutional Affiliation
- Area of Research Interest/Specialisation
- Professional Website URL (if available)
- Avatar image (generated using the UI Avatars API)

## CSV Column Mapping

When parsing the CSV data from the Google Sheet, the component maps columns as follows:
- Column 2: Last Name (SURNAME / LAST NAME)
- Column 3: First Name (FIRST NAME)
- Column 11: Research Area (AREA OF RESEARCH INTEREST / SPECIALISATION)
- Column 12: Affiliation (INSTITUTIONAL AFFILIATION)
- Column 13: Profile URL (Link to professional webpage)

## Avatar Generation

The application uses the UI Avatars API to create avatars for all members based on their names.

### How it works

1. The application takes the member's first and last name
2. Encodes it for a URL
3. Creates an avatar URL in this format: `https://ui-avatars.com/api/?name=First+Last&background=random&size=128`

### Customization options

You can customize avatars with parameters like:
- `name`: The name to display (initials will be extracted)
- `background`: Background color (hex without #, or "random")
- `color`: Text color (hex without #, defaults to white)
- `size`: Image size in pixels

## Component Structure

- `MembershipPage.tsx`: Main component that manages state and renders the member grid
- `MemberCard.tsx`: Card component for displaying individual member information
- `googleFormsUtils.ts`: Utility functions and types for member data handling

## Browser Security Limitations

When running locally, browser security restrictions (CORS) often prevent direct access to Google Sheets. In these cases:

1. The fallback data will be used automatically
2. A notification will appear indicating the use of fallback data
3. The data displayed is still accurate, just not dynamically fetched

## Future Enhancements

For a fully dynamic solution, consider:

1. **Backend Proxy**: Create a simple server that fetches the Google Sheet data and serves it to the frontend
2. **Published JSON**: Export the sheet as JSON and host it on a CORS-enabled server
3. **Google Sheets API**: Configure proper API access with authentication

These approaches would allow truly dynamic data fetching without browser security limitations. 