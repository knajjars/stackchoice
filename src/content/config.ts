import { defineCollection, z } from "astro:content";

const Pricing = z
  .object({
    price: z.number().nullable(),
    teamMembers: z.union([z.number(), z.literal("unlimited")]).nullable(),
    projects: z.union([z.number(), z.literal("unlimited")]).nullable(),
    authUsers: z.union([z.number(), z.literal("unlimited")]).nullable(),
    dbStorage: z.number().nullable(),
    dbBandwidth: z.number().nullable(),
    fileStorage: z.number().nullable(),
    fileBandwidth: z.number().nullable(),
    functionCalls: z.number().nullable(),
    note: z.string().nullable(),
  })
  .transform((pricing) => {
    return {
      Price: pricing.price,
      "Team members": pricing.teamMembers,
      Projects: pricing.projects,
      "Auth users": pricing.authUsers,
      "DB storage": pricing.dbStorage,
      "DB bandwidth": pricing.dbBandwidth,
      "File storage": pricing.fileStorage,
      "File bandwidth": pricing.fileBandwidth,
      "Function calls": pricing.functionCalls,
      Note: pricing.note,
    };
  });

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
          freeTierLimits: Pricing,
          pricedTier: Pricing,
          overagePricing: Pricing,
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
