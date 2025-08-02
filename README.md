# Google Contacts Birthday Manager

A command-line tool to manage and delete birthdays from your Google Contacts.

## Features

- 🔐 **Secure OAuth Authentication** - Authenticate with your Google account
- 📋 **List Contacts** - View all contacts that have birthdays
- 🗑️ **Selective Deletion** - Choose which contacts to remove birthdays from
- 🎨 **Beautiful CLI Interface** - Colorful and intuitive command-line interface
- ✅ **Safe Operations** - Confirmation prompts before making changes

## Prerequisites

Before you can use this tool, you need to set up Google API credentials:

> **⚠️ IMPORTANT**: After setting up credentials, you must add your email as a test user to avoid "Access blocked" errors!

### 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google People API** (Contacts API)

### 2. Create OAuth Credentials

1. In the Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
3. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type (unless you have a Google Workspace)
   - Fill in the required fields (App name, User support email, etc.)
   - **CRITICAL**: Add your email to test users (see step 4 below)
4. For Application type, choose **Desktop application**
5. **IMPORTANT**: In the **Authorized redirect URIs** section, add:
   ```
   http://localhost:3000
   ```
   > **Note**: This URL is required because the CLI creates a temporary local server on port 3000 to receive the OAuth authorization code.
6. Give it a name (e.g., "Contacts Birthday Manager")
7. Click **Create**

### 3. Add Yourself as Test User (REQUIRED)

**This step is essential to avoid "Access blocked" errors:**

1. Go to **APIs & Services** > **OAuth consent screen**
2. Scroll down to **Test users** section
3. Click **+ ADD USERS**
4. Add your email address (the one you'll authenticate with)
5. Click **Save**

### 4. Download Credentials

1. Download the credentials JSON file
2. Rename it to `credentials.json`
3. Place it in the same directory as this project

## Installation

1. Clone or download this project
2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Place your `credentials.json` file in the project root

## Usage

Run the CLI tool:\*\*\*\*

```bash
pnpm start
# or
pnpm contacts
# or
npm start
```

### First Run

On your first run:

1. The tool will automatically open your web browser for Google OAuth authentication
2. Sign in with your Google account
3. Grant permission to access your contacts
4. You'll be redirected to a success page
5. Return to the terminal to continue

The authentication token will be saved locally for future use.

### Menu Options

- **📋 List all contacts with birthdays** - View all contacts that have birthday information
- **🗑️ Delete birthdays from selected contacts** - Interactively select contacts to remove birthdays from
- **❌ Exit** - Quit the application

### Selecting Contacts for Deletion

When deleting birthdays:

1. You'll see a list of all contacts with birthdays
2. Use the spacebar to select/deselect contacts
3. Use arrow keys to navigate
4. Press Enter to confirm your selection
5. Confirm the deletion when prompted

## File Structure

```
contacts-del/
├── credentials.json    # Your Google API credentials (you provide this)
├── token.json         # OAuth token (generated automatically)
├── src/
│   └── index.ts       # Main application
├── package.json
└── README.md
```

## Security Notes

- Your `credentials.json` and `token.json` files contain sensitive information
- These files are excluded from git via `.gitignore`
- The OAuth token has limited scope (only contacts access)
- All operations require explicit user confirmation
- The OAuth callback uses `http://localhost:3000` (only accessible locally)

## Troubleshooting

### ❌ "Access blocked: contacts has not completed the Google verification process"

**This is the most common issue!** Fix it by adding yourself as a test user:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **OAuth consent screen**
3. Scroll down to **Test users** section
4. Click **+ ADD USERS**
5. Add your email address (the one you'll authenticate with)
6. Click **Save**
7. Try running the CLI again

### "Missing credentials.json file!"

Make sure you've downloaded the OAuth credentials from Google Cloud Console and placed them in the project root directory as `credentials.json`.

### "Authentication timeout"

If the OAuth flow times out:

1. Make sure you have a stable internet connection
2. Try running the command again
3. Check that your credentials.json file is valid

### "Error updating contact"

Some contacts might be read-only or have restrictions. The tool will continue with other contacts and report which ones failed.

### Browser doesn't open automatically

If the browser doesn't open automatically for authentication, copy the URL shown in the terminal and paste it into your browser manually.

### "redirect_uri_mismatch" error

If you see a redirect URI mismatch error:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, make sure you have: `http://localhost:3000`
5. Save and try again

## Development

For development with auto-reload:

```bash
pnpm dev
```

To build TypeScript:

```bash
pnpm build
```

## API Reference

This tool uses the [Google People API](https://developers.google.com/people) to:

- List contacts with the `people.connections.list` endpoint
- Update contacts with the `people.updateContact` endpoint
- Specifically manages the `birthdays` field of contact records

## License

MIT License - feel free to use and modify as needed.
