# Google Contacts Birthday Manager

A web application to easily manage and remove birthday information from your Google Contacts.

## Features

- 🔐 Secure Google OAuth authentication
- 📋 View all contacts with birthday information
- 🗑️ Selectively delete birthday data from contacts
- 🎨 Modern, responsive UI built with Next.js and Shadcn UI
- 🔒 Privacy-first: No data stored on servers

## Prerequisites

- Node.js 18+ and pnpm
- Google Cloud Console project with People API enabled

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google People API** (Contacts API):
   - Go to "APIs & Services" > "Library"
   - Search for "People API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/auth/callback`
5. Set up OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Add your email as a test user to avoid "Access blocked" errors

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

Replace the values with your actual Google OAuth credentials from step 1.

### 3. Installation

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Authentication**: Click "Get Started" to authenticate with your Google account
2. **View Contacts**: After authentication, you'll see all contacts with birthday information
3. **Delete Birthdays**: Click the delete button next to any contact to remove their birthday data
4. **Logout**: Use the logout button to clear your session

## Privacy & Security

- ✅ Uses Google OAuth for secure authentication
- ✅ No contact data is stored on our servers
- ✅ Only accesses birthday information from your contacts
- ✅ You can revoke access anytime from your Google Account settings

## Development

This is a [Next.js](https://nextjs.org/) project built with:

- **Framework**: Next.js 15 with App Router
- **UI**: Shadcn UI + Tailwind CSS
- **API**: Google People API (googleapis)
- **Authentication**: Google OAuth 2.0

### Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── contacts/
│   │   ├── page.tsx          # Contacts listing page
│   │   └── delete-button.tsx # Delete button component
│   └── auth/callback/
│       └── route.ts          # OAuth callback handler
├── lib/
│   ├── actions.ts            # Server actions
│   ├── google.ts             # Google API utilities
│   └── utils.ts              # General utilities
└── components/ui/            # Shadcn UI components
```

## Troubleshooting

### "Access blocked" error during OAuth

1. Go to Google Cloud Console > OAuth consent screen
2. Scroll to "Test users" section
3. Add your email address as a test user
4. Save and try again

### "No contacts found"

- Make sure you have contacts with birthday information in Google Contacts
- Check that the Google People API is enabled in your project

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - feel free to use this project for your own needs.
