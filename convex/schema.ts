import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index('by_name', ['name']),

  businesses: defineTable({
    clientId: v.id('clients'),
    name: v.string(), // e.g., "Rediseño Web 2024"
    description: v.string(),
    type: v.union(
      v.literal('new_business'),
      v.literal('upsell'),
      v.literal('renewal'),
    ),
    stage: v.union(
      v.literal('discovery'),
      v.literal('qualified'),
      v.literal('proposal_sent'),
      v.literal('negotiation'),
      v.literal('closed_won'),
      v.literal('closed_lost'),
    ),
    value: v.number(),
    currency: v.string(),
    probability: v.optional(v.number()), // 0-100
    expectedCloseDate: v.optional(v.number()), // Timestamp
  }).index('by_client', ['clientId']),

  proposals: defineTable({
    businessId: v.id('businesses'),
    proposalNumber: v.string(), // e.g., PROP-001
    title: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('sent'),
      v.literal('viewed'),
      v.literal('accepted'),
      v.literal('declined'),
      v.literal('expired'),
    ),
    totalAmount: v.number(),
    validUntil: v.number(), // Timestamp
    content: v.optional(v.string()), // Markdown o JSON de la propuesta
    terms: v.optional(v.string()),
  }).index('by_business', ['businessId']),
});
