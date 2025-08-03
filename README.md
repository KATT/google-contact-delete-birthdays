# Google Contacts Birthday Manager

A web application to easily manage birthday information in your Google Contacts. Add, edit, or remove birthdays to keep your calendar notifications organized.

## Features

- 🔐 Secure Google OAuth authentication
- 📋 View all contacts with birthday information
- ➕ Add birthday information for important contacts
- ✏️ Edit existing birthday information
- 🗑️ Selectively delete birthday data from contacts
- 🎨 Modern, responsive UI built with Next.js and Shadcn UI
- 🔒 Privacy-first: No data stored on servers

## Use Cases

- **Clean up old Facebook syncs**: Remove birthday notifications for people you barely know
- **Add missing birthdays**: Add birthday information for important contacts
- **Update incorrect birthdays**: Edit existing birthday information
- **Organize notifications**: Keep your calendar clean with only relevant birthday reminders

## Environment Variables

This project uses [T3 Env](https://env.t3.gg/) for type-safe environment variable validation. Create a `.env` file in the root directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Required Variables

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `NODE_ENV`: Environment (development, production, test)

### Optional Variables

- `NEXT_PUBLIC_BASE_URL`: Base URL for the application (defaults to http://localhost:3000)
- `SKIP_ENV_VALIDATION`: Set to `true` to skip environment validation (for testing)

## Note

This project was mainly vibe coded, so please don't judge the code quality
