import { z } from "zod";

export const AmountThresholdSchema = z.object({
  zoneId: z.number({
    required_error: "Zone is required",
    invalid_type_error: "Zone must be a number",
  }),
  amount: z.string().refine((val) => Number(val) >= 0, {
    message: "Amount must be a positive value",
  }),
  isActive: z.boolean().optional(),
});
