import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index('by_name', ['name']),
  proposals: defineTable({
    clientId: v.id('clients'),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal('draft'),
      v.literal('sent'),
      v.literal('accepted'),
      v.literal('rejected'),
      v.literal('cancelled'),
    ),
    totalAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
    dueDate: v.optional(v.number()),
  })
    .index('by_client', ['clientId'])
    .index('by_status', ['status']),
});
