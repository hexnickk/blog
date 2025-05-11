import { z } from "zod";

let envSchema = z.object({});

export namespace Env {
  let env = envSchema.parse(process.env);
}
