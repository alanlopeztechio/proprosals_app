'use client';

import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, FileText, X, Check } from 'lucide-react';
import { TableSkeleton } from '@/components/TableSkeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NoteEditor } from '@/components/editor/NoteEditor';
import { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import { askAIAction } from './ai-action';
import { htmlToMarkdown } from '@/lib/utils/html-to-markdown';

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

/**
 * Detects whether a string is raw Markdown (vs HTML already).
 */
function looksLikeMarkdown(text: string): boolean {
  if (!text || text.startsWith('<')) return false;
  // More precise markdown detection
  return /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|\*\*.*?\*\*|__.*?__|\*\*.*?\*\*|^>\s|```/m.test(
    text,
  );
}

/**
 * Converts content (markdown or HTML) to HTML for display.
 */
function ensureHtmlForDisplay(text: string): string {
  if (!text) return '';

  try {
    if (looksLikeMarkdown(text)) {
      // Convert markdown to HTML
      const html = marked.parse(text, { async: false }) as string;
      return html;
    }
    // Already HTML
    return text;
  } catch (error) {
    console.error('Error converting content:', error);
    return text;
  }
}

export default function ProposalViewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const businessId = params.businessId as string;
  const proposalId = params.proposalId as string;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  const proposal = useQuery(api.queries.getProposalById, {
    id: proposalId as any,
  });
  const business = useQuery(api.queries.getBusinessById, {
    id: businessId as any,
  });

  const updateProposal = useMutation(api.mutations.updateProposal);

  const uploadProporsalFile = useAction(api.actions.uploadFile);

  const handleEditClick = useCallback(() => {
    if (proposal) {
      setIsEditing(true);
    }
  }, [proposal]);

  const handleSave = useCallback(async () => {
    if (!proposal) return;
    setIsSaving(true);
    try {
      const markdown = htmlToMarkdown(editedContent);

      console.log('Saving proposal content:', {
        originalLength: editedContent.length,
        markdownLength: markdown.length,
        preview: markdown.substring(0, 100),
      });

      await uploadProporsalFile({
        file: new TextEncoder().encode(markdown).buffer,
        filename: `proposal-${proposal._id}.md`,
        contentType: 'text/markdown',
        idProporsal: proposal._id,
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating proposal:', error);
    } finally {
      setIsSaving(false);
    }
  }, [proposal, editedContent, updateProposal]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);

    if (proposal?.url) {
      fetch(proposal.url)
        .then((res) => res.text())
        .then((content) => setEditedContent(content))
        .catch(() => setEditedContent(proposal?.content || ''));
    } else {
      setEditedContent(proposal?.content || '');
    }
  }, [proposal]);

  const handleRequestIA = useCallback(async () => {
    alert(
      'La IA está generando contenido para esta propuesta. Esto puede tardar unos momentos, por favor espera...',
    );
    if (!proposal) return;
    setIsAIProcessing(true);

    try {
      const { text } = await askAIAction(
        proposalId,
        'Genera una estructura detallada y profesional para esta propuesta, incluyendo: Resumen Ejecutivo, Objetivos, Solución Propuesta y Cierre con Llamada a la Acción.',
      );

      const htmlContent = marked.parse(text, { async: false }) as string;

      setEditedContent((prev) => prev + `\n\n${htmlContent}`);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsAIProcessing(false);
    }
  }, [proposalId]);

  useEffect(() => {
    if (!proposal) return;

    const loadContent = async () => {
      try {
        if (proposal.url) {
          const response = await fetch(proposal.url);

          console.log(
            'Fetching proposal content from URL:',
            proposal.url,
            'Status:',
            response.status,
          );
          if (response.ok) {
            const content = await response.text();
            console.log(
              'Loaded content length:',
              content.length,
              'Preview:',
              content.substring(0, 100),
            );
            setEditedContent(content);
            return;
          }
        }
        if (proposal.content) {
          console.log('Using proposal.content from DB');
          setEditedContent(proposal.content);
        }
      } catch (error) {
        console.error('Error loading proposal content:', error);
        if (proposal.content) {
          setEditedContent(proposal.content);
        }
      }
    };

    loadContent();
  }, [proposal]);

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
              {/* {!isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <FileText className="h-4 w-4 mr-2" />
                    Editar Documento
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )} */}
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

          <div className="bg-linear-to-b rounded-lg border bg-background shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-colors overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Contenido de la Propuesta
              </h3>
              <div className="flex items-center gap-4">
                {!isEditing && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditClick}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Editar Documento
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar
                    </Button>
                  </>
                )}
                {isEditing && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <NoteEditor
                content={editedContent}
                onChange={setEditedContent}
                onChangeEditable={setIsEditing}
                editable={isEditing}
                placeholder="Escribe el contenido de la propuesta..."
                proposalId={proposalId}
                isAILoading={isAIProcessing}
                onRequestAI={handleRequestIA}
              />
              {/* {isEditing && (
                <Button
                  onClick={handleAskAI}
                  disabled={isAIProcessing}
                  className="absolute bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-transform hover:scale-105"
                  title="Preguntar a IA"
                >
                  <Sparkles className="h-6 w-6" />
                </Button>
              )} */}

              {/* {isEditing ? (
                <NoteEditor
                  content={editedContent}
                  onChange={setEditedContent}
                  editable={true}
                  placeholder="Escribe el contenido de la propuesta..."
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  {proposal.content ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ensureHtmlForDisplay(proposal.content),
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic text-center py-8">
                      No hay contenido para esta propuesta.
                    </p>
                  )}
                </div>
              )} */}
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
    </div>
  );
}
