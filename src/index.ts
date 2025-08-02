import chalk from 'chalk';
import fs from 'fs/promises';
import { google } from 'googleapis';
import { createServer } from 'http';
import inquirer from 'inquirer';
import path from 'path';

// Configuration
const SCOPES = ['https://www.googleapis.com/auth/contacts'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

class GoogleContactsManager {
  private auth: any = null;

  constructor() {}

  async initialize() {
    console.log(chalk.blue.bold('🎂 Google Contacts Birthday Manager'));
    console.log(chalk.gray('=====================================\n'));

    try {
      await this.authenticate();
      await this.showMainMenu();
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error);
      process.exit(1);
    }
  }

  async authenticate() {
    console.log(chalk.yellow('🔐 Setting up authentication...\n'));

    // Check if credentials file exists
    try {
      await fs.access(CREDENTIALS_PATH);
    } catch {
      console.log(chalk.red('❌ Missing credentials.json file!'));
      console.log('\nTo get started:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Create a new project or select existing one');
      console.log('3. Enable the Google Contacts API');
      console.log('4. Create credentials (OAuth 2.0 Client IDs)');
      console.log('5. Download the credentials.json file');
      console.log('6. Place it in the current directory\n');
      process.exit(1);
    }

    // Load credentials
    const credentialsContent = await fs.readFile(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    const { client_secret, client_id, redirect_uris } =
      credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // Check if we have a token
    try {
      const tokenContent = await fs.readFile(TOKEN_PATH, 'utf8');
      const token = JSON.parse(tokenContent);
      oAuth2Client.setCredentials(token);
      this.auth = oAuth2Client;
      console.log(chalk.green('✅ Authentication successful!\n'));
    } catch {
      // Need to get new token
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });

      console.log(chalk.cyan('🌐 Opening browser for authentication...'));
      console.log(chalk.yellow("If browser doesn't open, visit this URL:"));
      console.log(chalk.underline(authUrl));
      console.log();

      // Try to open browser (works on most systems)
      const { default: open } = await import('open');
      await open(authUrl).catch(() => {
        console.log(chalk.yellow('Could not open browser automatically.'));
      });

      // Create a simple HTTP server to capture the callback
      return new Promise((resolve, reject) => {
        const server = createServer(async (req, res) => {
          if (req.url?.startsWith('/?code=')) {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const code = url.searchParams.get('code');

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
			  <html>
				<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
				  <h2 style="color: green;">✅ Authentication Successful!</h2>
				  <p>You can now close this tab and return to the terminal.</p>
				</body>
			  </html>
			`);

            server.close();

            try {
              const { tokens } = await oAuth2Client.getToken(code!);
              oAuth2Client.setCredentials(tokens);

              // Save token for future use
              await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

              this.auth = oAuth2Client;
              console.log(chalk.green('✅ Token saved successfully!\n'));
              resolve(tokens);
            } catch (error) {
              console.error(chalk.red('❌ Error getting token:'), error);
              reject(error);
            }
          }
        });

        server.listen(3000, () => {
          console.log(chalk.gray('Waiting for authentication callback...\n'));
        });

        // Timeout after 5 minutes
        setTimeout(() => {
          server.close();
          reject(new Error('Authentication timeout'));
        }, 300000);
      });
    }
  }

  async getNewToken(oAuth2Client: any) {}

  async showMainMenu() {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📋 List all contacts with birthdays', value: 'list' },
        {
          name: '🗑️  Delete birthdays from selected contacts',
          value: 'delete',
        },
        { name: '❌ Exit', value: 'exit' },
      ],
    });

    switch (action) {
      case 'list':
        await this.listContacts();
        break;
      case 'delete':
        await this.deleteBirthdays();
        break;
      case 'exit':
        console.log(chalk.cyan('👋 Goodbye!'));
        process.exit(0);
    }
  }

  async listContacts() {
    console.log(chalk.yellow('📡 Fetching contacts...\n'));

    const contacts = await this.fetchContactsWithBirthdays();

    if (contacts.length === 0) {
      console.log(chalk.gray('No contacts with birthdays found.'));
    } else {
      console.log(
        chalk.green(`Found ${contacts.length} contacts with birthdays:\n`),
      );
      for (const [index, contact] of contacts.entries()) {
        console.log(
          `${chalk.cyan(index.toString().padStart(4))}. ${chalk.white(
            contact.displayName,
          )} - ${chalk.yellow(
            contact.birthdays?.map((it) => JSON.stringify(it.date)),
          )}`,
        );
      }
    }

    console.log();
    const { returnToMenu } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'returnToMenu',
        message: 'Return to main menu?',
        default: true,
      },
    ]);

    if (returnToMenu) {
      await this.showMainMenu();
    }
  }

  async deleteBirthdays() {
    console.log(chalk.yellow('📡 Fetching contacts with birthdays...\n'));

    const contacts = await this.fetchContactsWithBirthdays();

    if (contacts.length === 0) {
      console.log(chalk.gray('No contacts with birthdays found.'));
      await this.showMainMenu();
      return;
    }

    const res = await inquirer.prompt({
      type: 'checkbox',
      name: 'selectedContacts',
      message: 'Select contacts to remove birthdays from:',
      choices: contacts.map((contact) => ({
        name: `${contact.displayName} - ${contact.birthdays?.map((it) =>
          JSON.stringify(it.date),
        )}`,
        value: contact,
      })),
      pageSize: 15,
    });

    const selectedContacts = res.selectedContacts as typeof contacts;

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to delete birthdays from ${selectedContacts.length} contact(s)?`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.gray('Operation cancelled.'));
      await this.showMainMenu();
      return;
    }

    console.log(chalk.yellow('\n🗑️  Deleting birthdays...\n'));

    let successCount = 0;
    for (const contact of selectedContacts) {
      try {
        const people = google.people({ version: 'v1', auth: this.auth });

        // Create updated contact without birthdays
        const updateMask = 'birthdays';

        await people.people.updateContact({
          resourceName: contact.resourceName!,
          updatePersonFields: updateMask,
          requestBody: {
            resourceName: contact.resourceName,
            etag: contact.etag,
            birthdays: [], // Remove all birthdays
          },
        });
        console.log(chalk.green(`✅ ${contact.displayName}`));
        successCount++;
      } catch (error) {
        console.log(chalk.red(`❌ ${contact.displayName}: ${error}`));
      }
    }

    console.log(
      chalk.green(
        `\n🎉 Successfully deleted birthdays from ${successCount}/${selectedContacts.length} contacts!\n`,
      ),
    );

    const { returnToMenu } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'returnToMenu',
        message: 'Return to main menu?',
        default: true,
      },
    ]);

    if (returnToMenu) {
      await this.showMainMenu();
    }
  }

  async fetchContactsWithBirthdays() {
    const people = google.people({ version: 'v1', auth: this.auth });

    const response = await people.people.connections.list({
      resourceName: 'people/me',
      pageSize: 1000,
      personFields: 'names,birthdays,metadata',
    });

    const contacts = response.data.connections || [];

    return contacts
      .filter((contact) => contact.birthdays && contact.birthdays.length > 0)
      .map((contact) => {
        const displayName =
          contact.names?.[0]?.displayName || 'Unknown Contact';
        const birthday = contact.birthdays?.[0]?.date;
        const birthdayText = birthday
          ? `${birthday.month?.toString().padStart(2, '0')}/${birthday.day
              ?.toString()
              .padStart(2, '0')}${birthday.year ? `/${birthday.year}` : ''}`
          : 'Unknown Date';

        return {
          ...contact,
          displayName,
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
}

async function main() {
  const manager = new GoogleContactsManager();
  await manager.initialize();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n👋 Goodbye!'));
  process.exit(0);
});

// Run the application
if (require.main === module) {
  main().catch((error) => {
    console.error(chalk.red('💥 Fatal error:'), error);
    process.exit(1);
  });
}
