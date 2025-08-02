import chalk from 'chalk';
import fs from 'fs';
import { google, GoogleApis } from 'googleapis';
import { createServer } from 'http';
import inquirer from 'inquirer';
import open from 'open';
import path from 'path';

// Configuration
const SCOPES = ['https://www.googleapis.com/auth/contacts'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

type Oauth = GoogleApis['auth']['OAuth2'];
class GoogleContactsManager {
  private auth;

  constructor() {
    console.log(chalk.blue.bold('🎂 Google Contacts Birthday Manager'));
    console.log(chalk.gray('=====================================\n'));
    console.log(chalk.yellow('🔐 Setting up authentication...\n'));

    // Check if credentials file exists
    try {
      fs.accessSync(CREDENTIALS_PATH);
    } catch {
      console.log(chalk.red('❌ Missing credentials.json file!'));
      console.log('\nTo get started:');
      console.log('1. Go to https://console.cloud.google.com/');
      console.log('2. Create a new project or select existing one');
      console.log('3. Enable the Google People API (Contacts API)');
      console.log('4. Create credentials (OAuth 2.0 Client IDs)');
      console.log('5. Set redirect URI to: http://localhost:3000');
      console.log('6. Set up OAuth consent screen');
      console.log('7. Add your email as a TEST USER in OAuth consent screen');
      console.log('8. Download the credentials.json file');
      console.log('9. Place it in the current directory');
      console.log(
        chalk.yellow(
          '\n⚠️  IMPORTANT: Add your email as a test user to avoid "Access blocked" errors!',
        ),
      );
      console.log(
        chalk.cyan(
          '⚠️  CALLBACK URL: Set http://localhost:3000 as redirect URI\n',
        ),
      );
      process.exit(1);
    }

    // Load credentials
    const credentialsContent = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    const { client_secret, client_id, redirect_uris } =
      credentials.installed || credentials.web;

    this.auth = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    // Check if we have a token
    try {
      const tokenContent = fs.readFileSync(TOKEN_PATH, 'utf8');
      const token = JSON.parse(tokenContent);
      this.auth.setCredentials(token);

      console.log(chalk.green('✅ Authentication successful!\n'));

      this.showMainMenu();
    } catch {
      this.oauth().then(() => {
        this.showMainMenu();
      });
    }
  }

  async oauth() {
    // Need to get new token
    const authUrl = this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log(chalk.cyan('🌐 Opening browser for authentication...'));
    console.log(chalk.yellow("If browser doesn't open, visit this URL:"));
    console.log(chalk.underline(authUrl));
    console.log();

    // Try to open browser (works on most systems)
    await open(authUrl).catch(() => {
      console.log(chalk.yellow('Could not open browser automatically.'));
    });

    // Create a simple HTTP server to capture the callback
    return new Promise<void>((resolve, reject) => {
      const server = createServer(async (req, res) => {
        if (!req.url?.startsWith('/?code=')) {
          res.statusCode = 404;
          res.end();
          return;
        }
        const url = new URL(req.url, `http://${req.headers.host}`);
        const code = url.searchParams.get('code');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
				<html>
				  <body>
					<h2 style="color: green;">Authentication Successful!</h2>
					<p>You can now close this tab and return to the terminal.</p>
				  </body>
				</html>
			  `);

        server.close();

        try {
          const { tokens } = await this.auth.getToken(code!);
          this.auth.setCredentials(tokens);

          // Save token for future use
          fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

          console.log(chalk.green('✅ Token saved successfully!\n'));
          resolve();
        } catch (error) {
          console.error(chalk.red('❌ Error getting token:'), error);
          console.log(chalk.yellow('\n💡 If you see "Access blocked" errors:'));
          console.log('1. Go to https://console.cloud.google.com/');
          console.log('2. Navigate to APIs & Services > OAuth consent screen');
          console.log('3. Scroll down to "Test users" section');
          console.log('4. Click "+ ADD USERS" and add your email address');
          console.log('5. Save and try again\n');
          reject(error);
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
          `${chalk.cyan((index + 1).toString().padStart(4))}. ${chalk.white(
            contact.displayName,
          )} - ${chalk.yellow(
            contact.birthdays
              ?.map((it) => JSON.stringify(it.date))
              .join(', ') || 'Unknown Date',
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
        name: `${contact.displayName} - ${
          contact.birthdays?.map((it) => JSON.stringify(it.date)).join(', ') ||
          'Unknown Date'
        }`,
        value: contact,
      })),
      pageSize: 15,
    });

    const selectedContacts = res.selectedContacts as typeof contacts;

    if (selectedContacts.length === 0) {
      console.log(chalk.gray('No contacts selected.'));
      await this.showMainMenu();
      return;
    }

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

        await people.people.updateContact({
          resourceName: contact.resourceName!,
          updatePersonFields: 'birthdays',
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

  async fetchAllContacts() {
    const people = google.people({ version: 'v1', auth: this.auth });
    function fetchList(pageToken: string | undefined) {
      return people.people.connections.list({
        resourceName: 'people/me',
        pageSize: 1000,
        personFields: 'names,birthdays,metadata',
        pageToken,
      });
    }

    let pageToken: string | undefined | null = undefined;
    let responses: Awaited<ReturnType<typeof fetchList>>[] = [];

    let response;
    do {
      response = await fetchList(pageToken);
      pageToken = response.data.nextPageToken;
      responses.push(response);
    } while (pageToken);

    return responses;
  }

  async fetchContactsWithBirthdays() {
    const responses = await this.fetchAllContacts();

    const contacts = responses.map((it) => it.data.connections || []).flat();

    return contacts
      .filter((contact) => contact.birthdays?.filter((it) => it.date).length)
      .map((contact) => {
        const displayName =
          contact.names?.[0]?.displayName || 'Unknown Contact';
        return {
          ...contact,
          displayName,
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }
}

new GoogleContactsManager();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.cyan('\n👋 Goodbye!'));
  process.exit(0);
});
