import { mutation } from './_generated/server';

export const seedClients = mutation({
  args: {},
  handler: async (ctx) => {
    const clients = [
      {
        name: 'Juan Pérez',
        email: 'juan.perez@empresa.com',
        company: 'Tecnología Avanzada S.A.',
        phone: '+34 600 000 001',
        address: 'Calle Falsa 123, Madrid',
        notes: 'Cliente recurrente interesado en proyectos de IA.',
      },
      {
        name: 'María García',
        email: 'm.garcia@soluciones.es',
        company: 'Soluciones Creativas SL',
        phone: '+34 600 000 002',
        address: 'Avenida de la Constitución 45, Barcelona',
        notes: 'Prefiere contacto por email.',
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos@startup.io',
        company: 'Startup Innovadora',
        phone: '+34 600 000 003',
        address: 'Paseo de la Castellana 100, Madrid',
        notes: 'Nuevo cliente, primera propuesta enviada.',
      },
      {
        name: 'Ana Martínez',
        email: 'ana.m@logistica.com',
        company: 'Logística Global',
        phone: '+34 600 000 004',
        address: 'Polígono Industrial Norte, Valencia',
        notes: 'Busca optimización de procesos de transporte.',
      },
      {
        name: 'Roberto Gómez',
        email: 'roberto@construccion.es',
        company: 'Construcciones Gómez',
        phone: '+34 600 000 005',
        address: 'Plaza Mayor 1, Sevilla',
        notes: 'Interesado en presupuestos de mantenimiento anual.',
      },
    ];

    for (const client of clients) {
      // Opcional: Evitar duplicados por nombre si es necesario
      const existing = await ctx.db
        .query('clients')
        .withIndex('by_name', (q) => q.eq('name', client.name))
        .unique();

      if (!existing) {
        await ctx.db.insert('clients', client);
      }
    }

    return 'Seed de clientes completado con éxito.';
  },
});

export const seedProposals = mutation({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query('clients').collect();

    if (clients.length === 0) {
      return 'No hay clientes en la base de datos. Ejecuta seedClients primero.';
    }

    const proposalTemplates = [
      {
        title: 'Rediseño de Identidad Visual',
        description:
          'Creación de logotipo, paleta de colores y manual de marca.',
        status: 'accepted' as const,
        totalAmount: 1500,
        currency: 'EUR',
      },
      {
        title: 'Desarrollo de Sitio Web E-commerce',
        description:
          'Tienda online con pasarela de pagos y gestión de inventario.',
        status: 'sent' as const,
        totalAmount: 4500,
        currency: 'EUR',
      },
      {
        title: 'Campaña de Marketing Digital',
        description: 'Gestión de redes sociales y anuncios por 3 meses.',
        status: 'draft' as const,
        totalAmount: 900,
        currency: 'EUR',
      },
      {
        title: 'Mantenimiento IT Anual',
        description:
          'Soporte técnico y actualizaciones de seguridad mensuales.',
        status: 'sent' as const,
        totalAmount: 2400,
        currency: 'EUR',
      },
    ];

    let proposalsCreated = 0;

    for (const client of clients) {
      const existingProposals = await ctx.db
        .query('proposals')
        .withIndex('by_client', (q) => q.eq('clientId', client._id))
        .collect();

      if (existingProposals.length < 2) {
        const shuffled = [...proposalTemplates].sort(() => 0.5 - Math.random());
        const toAdd = shuffled.slice(0, 2);

        for (const template of toAdd) {
          await ctx.db.insert('proposals', {
            ...template,
            clientId: client._id,
            dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 días a partir de ahora
          });
          proposalsCreated++;
        }
      }
    }

    return `Seed de propuestas completado. Se crearon ${proposalsCreated} propuestas.`;
  },
});
