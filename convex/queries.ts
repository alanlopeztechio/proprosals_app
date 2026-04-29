import { v } from "convex/values";
import { query } from "./_generated/server";

// --- Clients Queries ---

export const getClients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clients").order("desc").collect();
  },
});

export const getClientById = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// --- Proposals Queries ---

export const getProposals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("proposals").order("desc").collect();
  },
});

export const getProposalById = query({
  args: { id: v.id("proposals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getProposalsByClient = query({
  args: { clientId: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("proposals")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();
  },
});
