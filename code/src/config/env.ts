import { z } from "zod";

const envSchema = z.object({
  TGC_API_BASE_URL: z.string().url().default("https://www.thegamecrafter.com"),
  TGC_API_KEY_ID: z.string().optional(),
  TGC_USERNAME: z.string().optional(),
  TGC_PASSWORD: z.string().optional(),
  TGC_REQUESTS_PER_SECOND: z.coerce.number().int().min(1).max(4).default(3),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function readEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfig {
  return envSchema.parse(env);
}

