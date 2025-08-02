import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { clearAuthToken, getContacts, isAuthenticated } from '@/lib/actions';
import { ArrowLeft, Calendar, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DeleteButton } from './delete-button';

async function ContactsList() {
  const contacts = await getContacts();

  if (contacts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No contacts with birthdays found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              All your contacts either don&apos;t have birthday information or
              it has already been removed.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contacts with Birthdays ({contacts.length})
        </CardTitle>
        <CardDescription>
          Click the delete button to remove birthday information from a contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.resourceName}>
                <TableCell className="font-medium">
                  {contact.displayName}
                </TableCell>
                <TableCell>
                  {contact.birthdays
                    ?.map((birthday) => {
                      const date = birthday.date;
                      if (date?.month && date?.day) {
                        return `${date.month}/${date.day}${
                          date.year ? `/${date.year}` : ''
                        }`;
                      }
                      return 'Unknown Date';
                    })
                    .join(', ') || 'Unknown Date'}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteButton
                    resourceName={contact.resourceName!}
                    etag={contact.etag!}
                    contactName={contact.displayName}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

async function LogoutButton() {
  async function handleLogout() {
    'use server';
    await clearAuthToken();
    redirect('/');
  }

  return (
    <form action={handleLogout}>
      <Button variant="outline" size="sm">
        Logout
      </Button>
    </form>
  );
}

export default async function ContactsPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Contacts</h1>
            <p className="text-gray-600">
              Manage birthday information for your Google Contacts
            </p>
          </div>
        </div>
        <LogoutButton />
      </div>

      <Alert className="mb-6">
        <Trash2 className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Deleting birthday information is permanent.
          Make sure you want to remove this data before proceeding.
        </AlertDescription>
      </Alert>

      <Suspense
        fallback={
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your contacts...</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <ContactsList />
      </Suspense>
    </div>
  );
}
