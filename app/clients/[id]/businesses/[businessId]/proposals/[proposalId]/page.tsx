'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Send, FileText } from 'lucide-react';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ChatSidebar from '@/components/ChatSidebar';

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  viewed: 'Vista',
  accepted: 'Aceptada',
  declined: 'Rechazada',
  expired: 'Expirada',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-yellow-100 text-yellow-800',
};

export default function ProposalViewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const businessId = params.businessId as string;
  const proposalId = params.proposalId as string;

  const proposal = useQuery(api.queries.getProposalById, {
    id: proposalId as any,
  });
  const business = useQuery(api.queries.getBusinessById, {
    id: businessId as any,
  });

  if (proposal === undefined || business === undefined) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-4 p-6 border-b border-border">
            <Link href={`/clients/${clientId}/businesses/${businessId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Cargando...</h1>
          </div>
          <div className="flex-1 p-6">
            <TableSkeleton />
          </div>
        </div>
        <div className="w-96 border-l">
          <ChatSidebar />
        </div>
      </div>
    );
  }

  if (!proposal || !business) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-4 p-6 border-b border-border">
            <Link href={`/clients/${clientId}/businesses/${businessId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-destructive">
              Propuesta no encontrada
            </h1>
          </div>
        </div>
        <div className="w-96 border-l">
          <ChatSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border sticky top-0 z-40">
          <div className="p-6 max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/clients/${clientId}/businesses/${businessId}`}>
                <Button variant="ghost" size="icon" title="Volver al Negocio">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{proposal.title}</h1>
                  <Badge variant="outline">{proposal.proposalNumber}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{business.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={STATUS_COLORS[proposal.status] || ''}>
                {STATUS_LABELS[proposal.status] || proposal.status}
              </Badge>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Editar Documento
              </Button>
              <Button size="sm">
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-linear-to-b p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
              <p className="text-2xl font-bold">
                {business.currency || '$'}
                {proposal.totalAmount.toLocaleString()}
              </p>
            </Card>
            <Card className="bg-linear-to-b p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Vencimiento</p>
              <p className="text-lg font-semibold">
                {proposal.validUntil
                  ? new Date(proposal.validUntil).toLocaleDateString('es-MX')
                  : '-'}
              </p>
            </Card>
          </div>

          <div className="bg-linear-to-b rounded-lg border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Contenido de la Propuesta
              </h3>
            </div>
            <div className="p-8 prose max-w-none">
              {proposal.content ? (
                <div dangerouslySetInnerHTML={{ __html: proposal.content }} />
              ) : (
                <p className="text-muted-foreground italic text-center py-8">
                  No hay contenido para esta propuesta.
                </p>
              )}
            </div>
          </div>

          {proposal.terms && (
            <div className="bg-linear-to-b rounded-lg border border-border p-6 mt-6">
              <h3 className="font-semibold mb-2">Términos y Condiciones</h3>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {proposal.terms}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-96 border-l flex flex-col h-screen sticky top-0">
        <ChatSidebar />
      </div>
    </div>
  );
}
