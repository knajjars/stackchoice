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
          relational: z.boolean(),
          migrations: z.boolean(),
          backup: z.boolean(),
          replication: z.boolean(),
          search: z.boolean(),
          engine: z.enum([
            "postgresql",
            "mysql",
            "mongodb",
            "sqlite",
            "firestore",
            "custom",
          ]),
        }),
        realtime: z.object({
          websockets: z.boolean(),
          presence: z.boolean(),
          pubsub: z.boolean(),
          realtimeDatabase: z.boolean(),
        }),
        functions: z.object({
          triggers: z.boolean(),
          httpEndpoints: z.boolean(),
          logging: z.boolean(),
        }),
        selfHosted: z.object({
          licenseType: z.enum(["opensource", "commercial", "hybrid", "none"]),
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
          cron: z.boolean(),
          queueing: z.boolean(),
          scheduling: z.boolean(),
        }),
        pushNotifications: z.object({
          ios: z.boolean(),
          android: z.boolean(),
          web: z.boolean(),
        }),
        permissions: z.object({
          rbac: z.boolean(),
          customRules: z.boolean(),
          rowLevelSecurity: z.boolean(),
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
