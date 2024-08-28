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
        authentication: z
          .object({
            social: z.boolean(),
            email: z.boolean(),
            phone: z.boolean(),
            magicLinks: z.boolean(),
            saml: z.boolean(),
            oidc: z.boolean(),
            userManagement: z.boolean(),
            freeMonthlyActiveUsers: z.number(),
            pricePerExtraActiveUser: z.number(),
          })
          .optional(),
        database: z.object({}).optional(),
        realtime: z.object({}).optional(),
        functions: z.object({}).optional(),
        selfHosted: z.object({}).optional(),
        storage: z.object({}).optional(),
        vectorDatabase: z.object({}).optional(),
        scheduledJobs: z.object({}).optional(),
        pushNotifications: z.object({}).optional(),
        permissions: z.object({}).optional(),
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
