export type ToolResultEnvelope = {
  ok: boolean;
  data: Record<string, unknown> | null;
  error: {
    code: string;
    message: string;
    details: Record<string, unknown> | null;
  } | null;
};

export function ok(data: Record<string, unknown> = {}): ToolResultEnvelope {
  return { ok: true, data, error: null };
}

export function fail(
  code: string,
  message: string,
  details: Record<string, unknown> | null = null,
): ToolResultEnvelope {
  return { ok: false, data: null, error: { code, message, details } };
}

