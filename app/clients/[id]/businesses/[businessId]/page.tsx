'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Activity,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function BusinessDetailsPage() {
  const params = useParams();
  const clientId = params.id as string;
  const businessId = params.businessId as string;

  const business = useQuery(api.queries.getBusinessById, {
    id: businessId as any,
  });
  const client = useQuery(api.queries.getClientById, { id: clientId as any });
  const proposals = useQuery(api.queries.getProposalsByBusiness, {
    businessId: businessId as any,
  });

  if (
    business === undefined ||
    client === undefined ||
    proposals === undefined
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <Link href={`/clients/${clientId}`}>
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
    );
  }

  if (!business || !client) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex items-center gap-4 p-6 border-b border-border">
          <Link href={`/clients/${clientId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-destructive">
            Negocio no encontrado
          </h1>
        </div>
      </div>
    );
  }

  const expectedCloseDate = business.expectedCloseDate
    ? new Date(business.expectedCloseDate)
    : null;
  const daysUntilClose = expectedCloseDate
    ? Math.ceil(
        (expectedCloseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href={`/clients/${clientId}`}>
                <Button variant="ghost" size="icon" title="Volver">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{business.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {client.name} &middot; {business.type.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                  <DropdownMenuItem>Exportar</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge>
              {business.currency || '$'} {business.value?.toLocaleString()}
            </Badge>
            <Badge className={cn(STATUS_COLORS[business.stage])}>
              {STATUS_LABELS[business.stage]}
            </Badge>
            {daysUntilClose !== null && (
              <Badge variant="secondary">
                {daysUntilClose > 0
                  ? `${daysUntilClose}d para cierre esperado`
                  : 'Fecha de cierre vencida'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {business.currency || '$'}
                {business.value?.toLocaleString() || '0'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={cn(
                  'text-xl font-bold px-4 py-3',
                  STATUS_COLORS[business.stage],
                )}
              >
                {STATUS_LABELS[business.stage]}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fecha de Cierre Esperada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">
                {expectedCloseDate
                  ? expectedCloseDate.toLocaleDateString('es-MX')
                  : '-'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Días Restantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-xl font-bold ${daysUntilClose && daysUntilClose < 0 ? 'text-destructive' : ''}`}
              >
                {daysUntilClose !== null ? `${daysUntilClose}d` : '-'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description Section */}
        {business.description && (
          <div className="bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-3">Descripción</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {business.description}
            </p>
          </div>
        )}

        {/* Contact Actions */}
        <div className="bg-background p-6 rounded-lg border border-border">
          <h2 className="text-lg font-semibold mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Llamada
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Reunión
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensaje
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Actividad
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="propuestas">Propuestas</TabsTrigger>
            <TabsTrigger value="actividad">Actividad</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
            <TabsTrigger value="archivos">Archivos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Información del Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium">{client.company || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{client.phone || '-'}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="propuestas" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Propuestas</h3>
              <Button size="sm">Crear Propuesta</Button>
            </div>
            {proposals && proposals.length > 0 ? (
              <div className="space-y-3">
                {proposals.map((proposal) => (
                  <Link
                    href={`/clients/${client._id}/businesses/${business._id}/proposals/${proposal._id}`}
                    key={proposal._id}
                  >
                    <div className="p-4 border border-border rounded-lg hover:border-primary/50 transition cursor-pointer bg-card hover:shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{proposal.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {proposal.proposalNumber}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Vence:{' '}
                            {proposal.validUntil
                              ? new Date(
                                  proposal.validUntil,
                                ).toLocaleDateString('es-MX')
                              : 'Sin fecha'}
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <p className="font-semibold text-lg">
                            {business.currency || '$'}
                            {proposal.totalAmount?.toLocaleString() || 0}
                          </p>
                          <Badge variant="outline" className="capitalize">
                            {proposal.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">
                  No hay propuestas para este negocio
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actividad" className="text-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground">
              No hay actividades registradas
            </p>
          </TabsContent>

          <TabsContent value="notas" className="text-center py-12">
            <p className="text-muted-foreground">No hay notas agregadas</p>
          </TabsContent>

          <TabsContent value="archivos" className="text-center py-12">
            <p className="text-muted-foreground">No hay archivos adjuntos</p>
          </TabsContent>
        </Tabs>

        {/* Información del Negocio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Información</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                Negocio para {client.name}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-linear-to-br from-accent/5 to-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="text-accent-foreground">
                Próximas Acciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                Sin tareas pendientes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
