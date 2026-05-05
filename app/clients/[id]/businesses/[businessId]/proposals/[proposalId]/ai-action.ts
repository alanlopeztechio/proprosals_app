'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function askAIAction(proposalId: string, userInstruction?: string) {
  // 1. Obtener el contexto completo desde Convex
  const context = await client.query(api.queries.getProposalContext, { 
    proposalId: proposalId as Id<"proposals"> 
  });

  if (!context || !context.proposal || !context.business || !context.client) {
    throw new Error("No se pudo obtener el contexto completo para la propuesta.");
  }

  const { proposal, business, client: customer } = context;

  // 2. Construir el prompt basado en la investigación de CRM
  const systemPrompt = `Actúa como un experto en ventas y consultoría estratégica. Tu objetivo es redactar propuestas comerciales que sean claras, concisas y altamente persuasivas.

DATOS DEL CLIENTE:
- Empresa: ${customer.company || 'N/A'}
- Industria: ${customer.industry || 'N/A'}
- Notas clave: ${customer.notes || 'Sin notas adicionales'}

DATOS DEL NEGOCIO (PROYECTO):
- Título del Proyecto: ${business.name}
- Tipo de Negocio: ${business.type} (new_business=Nuevo cliente, renewal=Renovación, upsell=Venta adicional)
- Valor Estimado: ${business.value} ${business.currency}
- Fase Actual: ${business.stage}

DETALLES DE LA PROPUESTA:
- Número de Propuesta: ${proposal.proposalNumber}
- Título: ${proposal.title}
- Términos: ${proposal.terms || 'A convenir'}
- Válida hasta: ${new Date(proposal.validUntil).toLocaleDateString()}

INSTRUCCIONES DE REDACCIÓN:
1. Adapta el tono a la industria (${customer.industry}).
2. Resalta el valor estratégico del proyecto para los objetivos del cliente.
3. Si es una renovación o upsell, menciona la relación previa.
4. Sé profesional pero directo. Evita párrafos excesivamente largos.
5. Estructura la respuesta con Markdown (Títulos, Listas, Negritas).`;

  const prompt = userInstruction 
    ? `Basado en el contexto anterior, realiza lo siguiente: ${userInstruction}`
    : `Genera una estructura detallada y profesional para esta propuesta, incluyendo: Resumen Ejecutivo, Objetivos, Solución Propuesta y Cierre con Llamada a la Acción.`;

  const { text, finishReason, usage } = await generateText({
    model: google('gemini-1.5-flash'),
    system: systemPrompt,
    prompt: prompt,
  });

  return { text, finishReason, usage };
}
