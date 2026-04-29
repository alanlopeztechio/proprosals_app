'use client';

import { TableSkeleton } from '@/components/TableSkeleton';
import { CreateClientDialog } from '@/components/dialogs/CreateClientDialog';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ClientTable } from '@/components/ClientTable';

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const contacts = useQuery(api.queries.getClients);

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-background h-screen">
      <main className="flex flex-1 w-full max-w-6xl flex-col bg-background items-center justify-start py-8 px-16 sm:items-start gap-8">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">Contactos</h1>
          </div>
          <div className="flex items-center gap-3">
            <CreateClientDialog
              open={showDialog}
              onOpenChange={setShowDialog}
            />
          </div>
        </div>
        {contacts === undefined ? (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Clientes</h2>
            <TableSkeleton />
          </div>
        ) : (
          <div className="w-full h-full">
            <h2 className="text-xl font-semibold mb-4">Clientes</h2>
            <ClientTable clients={contacts} />
          </div>
        )}
      </main>
    </div>
  );
}
