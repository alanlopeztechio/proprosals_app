import { v } from "convex/values";
import { mutation } from "./_generated/server";

// --- Clients Mutations ---

export const createClient = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clients", args);
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// --- Businesses Mutations ---

export const createBusiness = mutation({
  args: {
    clientId: v.id("clients"), description: v.string(),
    name: v.string(),
    type: v.union(v.literal("new_business"), v.literal("upsell"), v.literal("renewal")),
    stage: v.union(
      v.literal("discovery"),
      v.literal("qualified"),
      v.literal("proposal_sent"),
      v.literal("negotiation"),
      v.literal("closed_won"),
      v.literal("closed_lost")
    ),
    value: v.number(),
    currency: v.string(),
    probability: v.optional(v.number()),
    expectedCloseDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("businesses", args);
  },
});

export const updateBusiness = mutation({
  args: {
    id: v.id("businesses"),
    clientId: v.optional(v.id("clients")),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("new_business"), v.literal("upsell"), v.literal("renewal"))),
    stage: v.optional(v.union(
      v.literal("discovery"),
      v.literal("qualified"),
      v.literal("proposal_sent"),
      v.literal("negotiation"),
      v.literal("closed_won"),
      v.literal("closed_lost")
    )),
    value: v.optional(v.number()),
    currency: v.optional(v.string()),
    probability: v.optional(v.number()),
    expectedCloseDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteBusiness = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// --- Proposals Mutations ---

export const createProposal = mutation({
  args: {
    businessId: v.id("businesses"),
    proposalNumber: v.string(),
    title: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("expired")
    ),
    totalAmount: v.number(),
    validUntil: v.number(),
    content: v.optional(v.string()),
    terms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("proposals", args);
  },
});

export const updateProposal = mutation({
  args: {
    id: v.id("proposals"),
    businessId: v.optional(v.id("businesses")),
    proposalNumber: v.optional(v.string()),
    title: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("expired")
    )),
    totalAmount: v.optional(v.number()),
    validUntil: v.optional(v.number()),
    content: v.optional(v.string()),
    terms: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const deleteProposal = mutation({
  args: { id: v.id("proposals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
