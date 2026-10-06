import { z } from "zod";

let envSchema = z.object({
  VITE_HOST_URL: z.string(),
});

export namespace Env {
  const env = envSchema.parse(import.meta.env);

  export const HOST_URL = env.VITE_HOST_URL;
}
