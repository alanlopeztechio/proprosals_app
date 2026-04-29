import { v } from 'convex/values';
import { query } from './_generated/server';

export const getClients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('clients').order('desc').collect();
  },
});

export const getClientById = query({
  args: { id: v.id('clients') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBusinesses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('businesses').order('desc').collect();
  },
});

export const getBusinessById = query({
  args: { id: v.id('businesses') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBusinessesByClient = query({
  args: { clientId: v.id('clients') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('businesses')
      .withIndex('by_client', (q) => q.eq('clientId', args.clientId))
      .collect();
  },
});

export const getProposals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('proposals').order('desc').collect();
  },
});

export const getProposalById = query({
  args: { id: v.id('proposals') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProposalsByBusiness = query({
  args: { businessId: v.id('businesses') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('proposals')
      .withIndex('by_business', (q) => q.eq('businessId', args.businessId))
      .collect();
  },
});
