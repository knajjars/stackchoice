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
      website: z
        .string()
        .url()
        .transform((url) => url + "?ref=stackchoice.dev"),
      name: z.string(),
      description: z.string(),
      shortDescription: z.string(),
      uniqueFeatures: z.array(z.string()),
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
            otp: z.boolean(),
            userManagement: z.boolean(),
          })
          .transform((input) => {
            const { sso, otp, ...rest } = input;
            return {
              ...rest,
              SSO: sso,
              OTP: otp,
            };
          }),
        database: z.object({
          relations: z.boolean(),
          migrations: z.boolean(),
          documents: z.boolean(),
          fullTextSearch: z.boolean(),
          vectorSearch: z.boolean(),
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
            queueing: z.boolean(),
            scheduling: z.boolean(),
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
            resumeUpload: z.boolean(),
            cdn: z.boolean(),
            imageProcessing: z.boolean(),
          })
          .transform((input) => {
            const { cdn, ...rest } = input;
            return { ...rest, CDN: cdn };
          }),
        pushNotifications: z
          .object({
            web: z.boolean(),
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
            hipaa: z.boolean().nullable(),
            gdpr: z.boolean().nullable(),
            soc2: z.boolean().nullable(),
            pci: z.boolean().nullable(),
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
      website: z
        .string()
        .url()
        .transform((url) => url + "?ref=stackchoice.dev"),
      name: z.string(),
      description: z.string(),
      shortDescription: z.string(),
      logo: image(),
      language: z.string(),
      repository: z.string().url(),
      uniqueFeatures: z.array(z.string()),
      features: z
        .object({
          adminInterface: z.boolean(),
          routing: z.boolean(),
          orm: z.boolean(),
          authentication: z.boolean(),
          authorization: z.boolean(),
          templateEngine: z.boolean(),
          modernJavaScriptFrameworkIntegration: z.boolean(),
          migrations: z.boolean(),
          caching: z.boolean(),
          testing: z.boolean(),
          cli: z.boolean(),
          restApi: z.boolean(),
          realtime: z.boolean(),
          queueing: z.boolean(),
          scheduling: z.boolean(),
          i18n: z.boolean(),
          emailHandling: z.boolean(),
          storage: z.boolean(),
          validation: z.boolean(),
          logging: z.boolean(),
        })
        .transform((input) => ({
          "Admin interface": input.adminInterface,
          Authentication: input.authentication,
          Authorization: input.authorization,
          Caching: input.caching,
          CLI: input.cli,
          "Email handling": input.emailHandling,
          Storage: input.storage,
          i18N: input.i18n,
          Logging: input.logging,
          Migrations: input.migrations,
          ORM: input.orm,
          Queueing: input.queueing,
          REST: input.restApi,
          Routing: input.routing,
          Scheduling: input.scheduling,
          "Template engine": input.templateEngine,
          "Works with modern JS frameworks":
            input.modernJavaScriptFrameworkIntegration,
          Testing: input.testing,
          Validation: input.validation,
          Realtime: input.realtime,
        })),
    }),
});

export const collections = { baasProvider, fullStackFramework };
