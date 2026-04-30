import { v } from 'convex/values';
import { action, internalMutation } from './_generated/server';
import { internal } from './_generated/api';
import { put } from '@vercel/blob';

export const uploadFile = action({
  args: {
    file: v.bytes(),
    filename: v.string(),
    contentType: v.optional(v.string()),
    idProporsal: v.id('proposals'),
  },
  handler: async (ctx, args) => {
    const { downloadUrl } = await put(args.filename, args.file, {
      access: 'public',
      contentType: args.contentType,
      allowOverwrite: true,
    });

    console.log('File uploaded to Vercel Blob:', downloadUrl);

    await ctx.runMutation(internal.actions.insertUrl, {
      url: downloadUrl,
      idProporsal: args.idProporsal,
    });

    return { success: true, url: downloadUrl };
  },
});

export const insertUrl = internalMutation({
  args: {
    url: v.string(),
    idProporsal: v.id('proposals'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch('proposals', args.idProporsal, {
      url: args.url,
    });
  },
});
