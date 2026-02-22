import { z } from "zod";

const envSchema = z.object({
  TGC_API_BASE_URL: z.string().url().default("https://www.thegamecrafter.com"),
  TGC_PUBLIC_API_KEY_ID: z.string().optional(),
  TGC_USERNAME: z.string().optional(),
  TGC_PASSWORD: z.string().optional(),
  TGC_REQUESTS_PER_SECOND: z.coerce.number().int().min(1).max(4).default(3),
});

export type EnvConfig = {
  TGC_API_BASE_URL: string;
  TGC_PUBLIC_API_KEY_ID?: string;
  TGC_USERNAME?: string;
  TGC_PASSWORD?: string;
  TGC_REQUESTS_PER_SECOND: number;
};

export function readEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfig {
  const parsed = envSchema.parse(env);
  return {
    TGC_API_BASE_URL: parsed.TGC_API_BASE_URL,
    TGC_PUBLIC_API_KEY_ID: parsed.TGC_PUBLIC_API_KEY_ID,
    TGC_USERNAME: parsed.TGC_USERNAME,
    TGC_PASSWORD: parsed.TGC_PASSWORD,
    TGC_REQUESTS_PER_SECOND: parsed.TGC_REQUESTS_PER_SECOND,
  };
}
