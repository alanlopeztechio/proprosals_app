'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/TableSkeleton';

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params.id as string;

  const client = useQuery(api.queries.getClientById, { id: clientId as any });
  const proposals = useQuery(api.queries.getProposalsByClient, {
    clientId: clientId as any,
  });

  if (client === undefined || proposals === undefined) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Cargando...</h1>
        </div>
        <div className="flex-1 p-6">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-destructive">
            Cliente no encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center gap-4 p-6 border-b border-border">
        <Link href="/">
          <Button variant="ghost" size="icon" title="Volver">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          <p className="text-sm text-muted-foreground">{client.company}</p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Email
              </h3>
              <p className="text-base">{client.email || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Teléfono
              </h3>
              <p className="text-base">{client.phone || '-'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Dirección
              </h3>
              <p className="text-base">{client.address || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                Empresa
              </h3>
              <p className="text-base">{client.company || '-'}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Notas
            </h3>
            <p className="text-base whitespace-pre-wrap bg-muted/50 p-4 rounded-lg">
              {client.notes}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">Propuestas</h2>
          {proposals && proposals.length > 0 ? (
            <div className="space-y-2">
              {proposals.map((proposal) => (
                <div
                  key={proposal._id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{proposal.title}</h3>
                      {proposal.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {proposal.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {proposal.totalAmount && (
                        <p className="font-semibold">
                          {proposal.currency || '$'}
                          {proposal.totalAmount}
                        </p>
                      )}
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-muted rounded-full">
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No hay propuestas para este cliente
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
