'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deleteBirthday } from '@/lib/actions';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
  resourceName: string;
  etag: string;
  contactName: string;
}

export function DeleteButton({
  resourceName,
  etag,
  contactName,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await deleteBirthday(resourceName, etag);
      if (result.success) {
        setIsDeleted(true);
      } else {
        alert('Failed to delete birthday. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting birthday:', error);
      alert('Failed to delete birthday. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  if (isDeleted) {
    return (
      <span className="text-green-600 text-sm font-medium">✅ Deleted</span>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Birthday Information</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete birthday information for{' '}
            <strong>{contactName}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete Birthday
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
