import { z } from "zod";

export const backupRequestSchema = z.object({
  backupStatus: z.boolean(),
});

export const restoreRequestSchema = z.object({
  restoreStatus: z.boolean(),
});