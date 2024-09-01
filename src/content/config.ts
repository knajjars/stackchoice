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
        }),
        database: z.object({
          relations: z.boolean(),
          migrations: z.boolean(),
          search: z.boolean(),
        }),
        realtime: z.object({
          pubsub: z.boolean(),
          realtimeDatabase: z.boolean(),
        }),
        functions: z.object({
          triggers: z.boolean(),
          runtime: z.array(z.string()),
        }),
        selfHosted: z.object({
          repository: z.string(),
        }),
        storage: z.object({
          fileUpload: z.boolean(),
          cdn: z.boolean(),
          imageProcessing: z.boolean(),
        }),
        vectorDatabase: z.object({
          embedding: z.boolean(),
          similarity: z.boolean(),
        }),
        jobs: z.object({
          queueing: z.boolean(),
          scheduling: z.boolean(),
        }),
        pushNotifications: z.object({
          ios: z.boolean(),
          android: z.boolean(),
        }),
        permissions: z.object({
          rbac: z.boolean(),
          customRules: z.boolean(),
          rowLevelSecurity: z.boolean(),
        }),
        compliances: z.object({
          hipaa: z.boolean(),
          gdpr: z.boolean(),
          soc2: z.boolean(),
          pci: z.boolean(),
        }),
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
