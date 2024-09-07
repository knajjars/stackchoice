import { defineCollection, z } from "astro:content";

const baasProvider = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      website: z.string().url(),
      name: z.string(),
      description: z.string(),
      shortDescription: z.string(),
      repository: z.string().optional(),
      logo: image(),
      sdks: z.array(z.string()),
      selfHosted: z.boolean(),
      cloudHosted: z.boolean(),
      pricing: z
        .object({
          freeTierLimits: z.object({
            teamMembers: z
              .union([z.number(), z.literal("unlimited")])
              .optional(),
            projects: z
              .union([z.number().optional(), z.literal("unlimited")])
              .optional(),
            authUsers: z
              .union([z.number().optional(), z.literal("unlimited")])
              .optional(),
            dbStorage: z.number().optional(),
            dbBandwidth: z.number().optional(),
            fileStorage: z.number().optional(),
            fileBandwidth: z.number().optional(),
            functionCalls: z.number().optional(),
            note: z.string().optional(),
          }),
          pricedTier: z
            .object({
              monthlyPrice: z.number().optional(),
              teamMembers: z
                .union([z.number().optional(), z.literal("unlimited")])
                .optional(),
              projects: z
                .union([z.number().optional(), z.literal("unlimited")])
                .optional(),
              authUsers: z
                .union([z.number().optional(), z.literal("unlimited")])
                .optional(),
              dbStorage: z.number().optional(),
              dbBandwidth: z.number().optional(),
              fileStorage: z.number().optional(),
              fileBandwidth: z.number().optional(),
              functionCalls: z.number().optional(),
              note: z.string().optional(),
            })
            .optional(),
          overagePricing: z.object({
            teamMembers: z
              .union([z.number(), z.literal("unlimited")])
              .optional(),
            projects: z
              .union([z.number().optional(), z.literal("unlimited")])
              .optional(),
            authUsers: z.number().optional(),
            dbStorage: z.number().optional(),
            dbBandwidth: z.number().optional(),
            fileStorage: z.number().optional(),
            fileBandwidth: z.number().optional(),
            functionCalls: z.number().optional(),
            note: z.string().optional(),
          }),
        })
        .optional(),
      features: z.object({
        authentication: z
          .object({
            social: z.boolean(),
            email: z.boolean(),
            phone: z.boolean(),
            magicLinks: z.boolean(),
            sso: z.boolean(),
            userManagement: z.boolean(),
          })
          .transform((input) => {
            const { sso, ...rest } = input;
            return {
              ...rest,
              SSO: sso,
            };
          }),
        database: z.object({
          relations: z.boolean(),
          migrations: z.boolean(),
          search: z.boolean(),
        }),
        realtime: z
          .object({
            pubsub: z.boolean(),
            realtimeDatabase: z.boolean(),
          })
          .transform((input) => {
            const { pubsub, ...rest } = input;
            return {
              ...rest,
              PubSub: pubsub,
            };
          }),
        functions: z
          .object({
            triggers: z.boolean(),
            runtime: z.array(z.string()),
          })
          .transform((input) => {
            const { runtime, ...rest } = input;
            return {
              ...rest,
              runtime: new Intl.ListFormat("en", {
                style: "long",
                type: "conjunction",
              }).format(runtime),
            };
          }),
        storage: z
          .object({
            fileUpload: z.boolean(),
            cdn: z.boolean(),
            imageProcessing: z.boolean(),
          })
          .transform((input) => {
            const { cdn, ...rest } = input;
            return { ...rest, CDN: cdn };
          }),
        vectorDatabase: z.object({
          embedding: z.boolean(),
          similarity: z.boolean(),
        }),
        jobs: z.object({
          queueing: z.boolean(),
          scheduling: z.boolean(),
        }),
        pushNotifications: z
          .object({
            ios: z.boolean(),
            android: z.boolean(),
          })
          .transform((input) => {
            const { ios, ...rest } = input;
            return {
              ...rest,
              IOS: ios,
            };
          }),
        permissions: z
          .object({
            rbac: z.boolean(),
            customRules: z.boolean(),
            rowLevelSecurity: z.boolean(),
          })
          .transform((input) => {
            const { rbac, ...rest } = input;
            return {
              ...rest,
              RBAC: rbac,
            };
          }),
        compliances: z
          .object({
            hipaa: z.boolean(),
            gdpr: z.boolean(),
            soc2: z.boolean(),
            pci: z.boolean(),
          })
          .transform((input) => ({
            HIPAA: input.hipaa,
            GDPR: input.gdpr,
            SOC2: input.soc2,
            PCI: input.pci,
          })),
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
