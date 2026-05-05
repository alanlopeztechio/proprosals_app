'use server';

import { generateText, stepCountIs } from 'ai';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { z } from 'zod';
import { fetchQuery } from 'convex/nextjs';

export async function askAIAction(
  proposalId: string,
  userInstruction?: string,
) {
  const systemPrompt = `Actúa como un experto en ventas y consultoría estratégica. Tu objetivo es redactar propuestas comerciales que sean claras, concisas y altamente persuasivas.

INSTRUCCIONES DE REDACCIÓN:
1. Antes de redactar CUALQUIER cosa, DEBES llamar al tool getProposalContext con el proposalId proporcionado.
2. Con los datos obtenidos del tool, adapta el tono a la industria del cliente.
3. Resalta el valor estratégico del proyecto para los objetivos del cliente.
4. Si el tipo de negocio es renewal o upsell, menciona la relación previa.
5. Sé profesional pero directo. Evita párrafos excesivamente largos.
6. Estructura la respuesta con Markdown (Títulos, Listas, Negritas).`;

  const prompt = userInstruction
    ? `El ID de la propuesta es: ${proposalId}. Basado en el contexto que obtengas, realiza lo siguiente: ${userInstruction}`
    : `El ID de la propuesta es: ${proposalId}. Obtén el contexto completo y genera una estructura detallada y profesional para esta propuesta, incluyendo: Resumen Ejecutivo, Objetivos, Solución Propuesta y Cierre con Llamada a la Acción.`;

  const { text, finishReason, usage } = await generateText({
    model: 'openai/gpt-4.1',
    system: systemPrompt,
    prompt,
    stopWhen: stepCountIs(5),
    tools: {
      getProposalContext: {
        description:
          'Obtiene el contexto completo de la propuesta, negocio y cliente desde Convex. SIEMPRE llama este tool primero antes de redactar.',
        inputSchema: z.object({
          proposalId: z
            .string()
            .describe(
              'ID de la propuesta para la cual se solicita el contexto.',
            ),
        }),
        execute: async ({ proposalId }) => {
          const context = await fetchQuery(api.queries.getProposalContext, {
            proposalId: proposalId as Id<'proposals'>,
          });

          return {
            customer: {
              company: context?.client?.company ?? 'N/A',
              industry: context?.client?.industry ?? 'N/A',
              notes: context?.client?.notes ?? 'Sin notas adicionales',
            },
            business: {
              name: context?.business?.name,
              type: context?.business?.type,
              value: context?.business?.value,
              currency: context?.business?.currency,
              stage: context?.business?.stage,
            },
            proposal: {
              proposalNumber: context?.proposal?.proposalNumber,
              title: context?.proposal?.title,
              terms: context?.proposal?.terms ?? 'A convenir',
              validUntil: context?.proposal?.validUntil
                ? new Date(context?.proposal?.validUntil).toLocaleDateString(
                    'es-MX',
                  )
                : 'N/A',
            },
          };
        },
      },
    },
  });

  return { text, finishReason, usage };
}
