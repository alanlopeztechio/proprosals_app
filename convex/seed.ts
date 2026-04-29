import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Limpiar datos existentes (opcional, pero útil para seeds limpios)
    // Nota: Solo haz esto si estás en desarrollo.
    
    // 2. Crear Clientes
    const clientIds = [];
    const clients = [
      {
        name: "Elena Rodríguez",
        email: "elena@techcorp.com",
        company: "TechCorp Solutions",
        industry: "Software",
        website: "https://techcorp.com",
      },
      {
        name: "Marcos Ruiz",
        email: "mruiz@designflow.es",
        company: "DesignFlow Studio",
        industry: "Design",
        website: "https://designflow.es",
      },
    ];

    for (const c of clients) {
      const id = await ctx.db.insert("clients", c);
      clientIds.push(id);
    }

    // 3. Crear Negocios para esos Clientes
    const businessTemplates = [
      {
        name: "Implementación ERP Fase 1", description: "Sistema integral ERP",
        type: "new_business" as const,
        stage: "qualified" as const,
        value: 12000,
        currency: "EUR",
        probability: 60,
      },
      {
        name: "Mantenimiento Anual Servidores", description: "Renovación 2026",
        type: "renewal" as const,
        stage: "negotiation" as const,
        value: 3500,
        currency: "EUR",
        probability: 85,
      },
      {
        name: "Consultoría de Seguridad", description: "Auditoría ISO 27001",
        type: "upsell" as const,
        stage: "proposal_sent" as const,
        value: 5000,
        currency: "EUR",
        probability: 40,
      },
    ];

    const businessIds = [];
    for (const clientId of clientIds) {
      // Cada cliente tendrá 2 negocios
      for (let i = 0; i < 2; i++) {
        const template = businessTemplates[Math.floor(Math.random() * businessTemplates.length)];
        const bId = await ctx.db.insert("businesses", {
          ...template,
          clientId,
          expectedCloseDate: Date.now() + (30 * 24 * 60 * 60 * 1000),
        });
        businessIds.push(bId);
      }
    }

    // 4. Crear Propuestas para los Negocios
    for (const businessId of businessIds) {
      const biz = await ctx.db.get(businessId);
      if (!biz) continue;

      await ctx.db.insert("proposals", {
        businessId,
        proposalNumber: `PROP-${Math.floor(Math.random() * 10000)}`,
        title: `Propuesta para ${biz.name}`,
        status: "sent" as const,
        totalAmount: biz.value,
        validUntil: Date.now() + (15 * 24 * 60 * 60 * 1000),
        terms: "Pago a 30 días tras aceptación.",
      });
    }

    return "Base de datos poblada con éxito: Clientes -> Negocios -> Propuestas.";
  },
});
