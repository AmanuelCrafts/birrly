import { z } from "zod";

export const vipPlanSchema = z.object({
  level: z.number().int().min(1).max(8),
  name: z.string(),
  depositAmount: z.number().positive(),
  dailyIncome: z.number().positive(),
  dailyTasksRequired: z.number().int().positive(),
  isActive: z.boolean(),
});

export type VIPPlanInput = z.infer<typeof vipPlanSchema>;
