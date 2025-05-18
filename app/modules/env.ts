import { z } from "zod";

let envSchema = z.object({
  HOST_URL: z.string(),
});

export namespace Env {
  let env = envSchema.parse(process.env);

  export const HOST_URL = env.HOST_URL;
}
