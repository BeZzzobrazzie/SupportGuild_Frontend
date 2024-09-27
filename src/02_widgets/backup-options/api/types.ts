import { z } from "zod";

export const backupRequestSchema = z.object({
  backupStatus: z.boolean(),
});
