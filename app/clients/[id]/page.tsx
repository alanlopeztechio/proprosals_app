'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/TableSkeleton';

const STATUS_LABELS: Record<string, string> = {
  discovery: 'Descubrimiento',
  qualified: 'Calificado',
  proposal_sent: 'Propuesta Enviada',
  negotiation: 'Negociación',
  closed_won: 'Cerrado Ganado',
  closed_lost: 'Cerrado Perdido',
};

const STATUS_COLORS: Record<string, string> = {
  discovery: 'bg-gray-100 text-gray-800 border-gray-200',
  qualified: 'bg-blue-100 text-blue-800 border-blue-200',
  proposal_sent: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  negotiation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  closed_won: 'bg-green-100 text-green-800 border-green-200',
  closed_lost: 'bg-red-100 text-red-800 border-red-200',
};

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = params.id as string;

  const client = useQuery(api.queries.getClientById, { id: clientId as any });
  const businesses = useQuery(api.queries.getBusinessesByClient, {
    clientId: clientId as any,
  });

  if (client === undefined || businesses === undefined) {
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
          <h2 className="text-2xl font-bold mb-4">Negocios</h2>
          {businesses && businesses.length > 0 ? (
            <div className="flex flex-col gap-8">
              {businesses.map((business) => (
                <Link
                  href={`/clients/${client._id}/businesses/${business._id}`}
                  key={business._id}
                >
                  <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition cursor-pointer">
                    <div className="flex items-center justify-between px-4 ">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#F59F0A] cursor-pointer hover:underline">
                          {business.name}
                        </h3>
                        {business.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {business.description.length > 100
                              ? `${business.description.substring(0, 100)}...`
                              : business.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {business.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex flex-col items-end gap-2">
                        {business.value !== undefined && (
                          <p className="font-semibold text-lg">
                            {business.currency || '$'}
                            {business.value.toLocaleString()}
                          </p>
                        )}
                        <Badge
                          className={`inline-block ${STATUS_COLORS[business.stage] || 'bg-gray-100 text-gray-800'}`}
                        >
                          {STATUS_LABELS[business.stage] || business.stage}
                        </Badge>
                        {business.probability !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            Probabilidad: {business.probability}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No hay negocios para este cliente
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
