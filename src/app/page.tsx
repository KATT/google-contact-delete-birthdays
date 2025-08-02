import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isAuthenticated, startOAuth } from '@/lib/actions';
import { AlertTriangle, Calendar, Shield, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

interface HomeProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const authenticated = await isAuthenticated();
  const { error } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {error && (
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Authentication Error:</strong>{' '}
            {error === 'oauth_error' &&
              'OAuth authentication failed. Please try again.'}
            {error === 'no_code' &&
              'No authorization code received. Please try again.'}
            {error === 'token_error' &&
              'Failed to exchange code for token. Please try again.'}
            {!['oauth_error', 'no_code', 'token_error'].includes(error) &&
              'An unexpected error occurred. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Calendar className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Google Contacts Birthday Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Easily manage and remove birthday information from your Google
          Contacts
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>View Contacts</CardTitle>
            <CardDescription>
              See all your contacts that have birthday information
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Trash2 className="h-8 w-8 text-red-600 mb-2" />
            <CardTitle>Remove Birthdays</CardTitle>
            <CardDescription>
              Selectively delete birthday data from specific contacts
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Secure Access</CardTitle>
            <CardDescription>
              Uses Google OAuth for secure access to your contacts
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Alert className="mb-8">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy Notice:</strong> This app only accesses your Google
          Contacts to show and modify birthday information. No data is stored on
          our servers.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        {authenticated ? (
          <div className="space-y-4">
            <p className="text-green-600 font-medium">
              ✅ You&apos;re already authenticated!
            </p>
            <Link href="/contacts">
              <Button size="lg" className="px-8 py-4 text-lg">
                View Your Contacts
              </Button>
            </Link>
          </div>
        ) : (
          <form action={startOAuth}>
            <Button size="lg" className="px-8 py-4 text-lg">
              Get Started - Connect Google Account
            </Button>
          </form>
        )}
      </div>

      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          This app requires access to your Google Contacts to function. You can
          revoke access at any time from your Google Account settings.
        </p>
      </div>
    </div>
  );
}
