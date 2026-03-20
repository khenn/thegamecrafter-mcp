import { z } from "zod";

const envSchema = z.object({
  TGC_API_BASE_URL: z.string().url().default("https://www.thegamecrafter.com"),
  TGC_PUBLIC_API_KEY_ID: z.string().optional(),
  TGC_USERNAME: z.string().optional(),
  TGC_PASSWORD: z.string().optional(),
  TGC_REQUESTS_PER_SECOND: z.coerce.number().int().min(1).max(4).default(3),
  TGC_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(100).max(120000).default(15000),
  TGC_GET_RETRY_COUNT: z.coerce.number().int().min(0).max(5).default(2),
  TGC_RETRY_BASE_DELAY_MS: z.coerce.number().int().min(0).max(5000).default(250),
});

export type EnvConfig = {
  TGC_API_BASE_URL: string;
  TGC_PUBLIC_API_KEY_ID?: string;
  TGC_USERNAME?: string;
  TGC_PASSWORD?: string;
  TGC_REQUESTS_PER_SECOND: number;
  TGC_REQUEST_TIMEOUT_MS: number;
  TGC_GET_RETRY_COUNT: number;
  TGC_RETRY_BASE_DELAY_MS: number;
};

export function readEnvConfig(env: NodeJS.ProcessEnv = process.env): EnvConfig {
  const parsed = envSchema.parse(env);
  return {
    TGC_API_BASE_URL: parsed.TGC_API_BASE_URL,
    TGC_PUBLIC_API_KEY_ID: parsed.TGC_PUBLIC_API_KEY_ID,
    TGC_USERNAME: parsed.TGC_USERNAME,
    TGC_PASSWORD: parsed.TGC_PASSWORD,
    TGC_REQUESTS_PER_SECOND: parsed.TGC_REQUESTS_PER_SECOND,
    TGC_REQUEST_TIMEOUT_MS: parsed.TGC_REQUEST_TIMEOUT_MS,
    TGC_GET_RETRY_COUNT: parsed.TGC_GET_RETRY_COUNT,
    TGC_RETRY_BASE_DELAY_MS: parsed.TGC_RETRY_BASE_DELAY_MS,
  };
}
