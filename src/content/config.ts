import { defineCollection, z } from "astro:content";

const baasProvider = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      website: z.string().url(),
      name: z.string(),
      description: z.string(),
      logo: image(),
      sdks: z.array(z.string()),
      features: z.object({
        authentication: z.object({
          social: z.boolean(),
          email: z.boolean(),
          phone: z.boolean(),
          magicLinks: z.boolean(),
          sso: z.boolean(),
          userManagement: z.boolean(),
          freeMonthlyActiveUsers: z.number(),
          pricePerExtraActiveUser: z.number(),
        }),
        database: z.object({}),
        realtime: z.object({}),
        functions: z.object({}),
        selfHosted: z.object({}),
        storage: z.object({}),
        vectorDatabase: z.object({}),
        scheduledJobs: z.object({}),
        pushNotifications: z.object({}),
        permissions: z.object({}),
      }),
    }),
});

const fullStackFramework = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      website: z.string().url(),
      name: z.string(),
      description: z.string(),
      logo: image(),
      language: z.string(),
    }),
});

export const collections = { baasProvider, fullStackFramework };
