import { defineCollection, z } from 'astro:content';
const help = defineCollection({
  type: 'content',
  schema: z.object({ title: z.string(), description: z.string(), category: z.string(), order: z.number(), keywords: z.array(z.string()).default([]), related: z.array(z.string()).default([]), screenshot: z.string().optional(), screenshotAlt: z.string().optional() }),
});
export const collections = { help };
