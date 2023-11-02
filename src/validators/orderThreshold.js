import { z } from "zod";

export const OrderThresholdSchema = z.object({
  threshold: z.number({
    required_error: "Threshold is required",
    invalid_type_error: "Threshold must be a number",
  }).gte(1),
  isActive: z.boolean().optional(),
});
