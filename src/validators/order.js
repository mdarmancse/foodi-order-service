import { z } from "zod";

export const OrderSchema = z.object({
  orderId: z
    .string({
      required_error: "Order id is required",
      invalid_type_error: "Order id would be string",
    })
    .optional(),
  userId: z.number({
    required_error: "User id is required",
    invalid_type_error: "UserId would be number",
  }),
  userName: z.string({
    required_error: "User name is required",
    invalid_type_error: "User name would be string",
  }),
  deliveryZoneId: z.number({
    required_error: "Delivery ZoneId is required",
    invalid_type_error: "Delivery ZoneId would be number",
  }),
  deliveryLat: z.number({
    required_error: "Delivery Lat is required",
    invalid_type_error: "Delivery Lat would be number",
  }),
  deliveryLong: z.number({
    required_error: "Delivery Long is required",
    invalid_type_error: "Delivery Long would be number",
  }),
  deliveryDistance: z.number({
    required_error: "Delivery distance is required",
    invalid_type_error: "Delivery distance would be number",
  }),
  deliveryAddress: z.string({
    required_error: "Delivery Address is required",
    invalid_type_error: "Delivery address would be string",
  }),
  deliveryApartmentName: z
    .string({
      required_error: "Delivery Apartment Name is required",
      invalid_type_error: "Delivery Apartment Name would be string",
    })
    .optional(),
  deliveryRoadOrFlatNumber: z
    .string({
      required_error: "Delivery road or flat is required",
      invalid_type_error: "Delivery road or flat would be string",
    })
    .optional(),
  isItGift: z
    .boolean({
      required_error: "Is gift is required",
      invalid_type_error: "Is gift would be boolean",
    })
    .optional(),
  giftReceiverName: z
    .string({
      required_error: "Gift receiver name is required",
      invalid_type_error: "Gift receiver name would be string",
    })
    .optional(),
  giftReceiverMobile: z
    .string({
      required_error: "Gift receiver mobile is required",
      invalid_type_error: "Gift receiver mobile would be string",
    })
    .optional(),
  riderId: z
    .number({
      required_error: "Rider Id is required",
      invalid_type_error: "Rider ID would be number",
    })
    .optional(),
  riderName: z
    .string({
      required_error: "Rider name is required",
      invalid_type_error: "Rider name would be string",
    })
    .optional(),
  branchId: z.number({
    required_error: "Branch Id is required",
    invalid_type_error: "Branch Id would be number",
  }),
  branchName: z.string({
    required_error: "Branch name is required",
    invalid_type_error: "Branch name would be string",
  }),
  branchZoneId: z.number({
    required_error: "Branch ZoneId is required",
    invalid_type_error: "Branch ZoneId would be number",
  }),
  branchLat: z.number({
    required_error: "Branch Lat is required",
    invalid_type_error: "Branch Lat would be number",
  }),
  branchLong: z.number({
    required_error: "Branch Long is required",
    invalid_type_error: "Branch Long would be number",
  }),
  paymentId: z
    .number({
      required_error: "Payment is required",
      invalid_type_error: "Payment id would be number",
    })
    .optional(),
  riderPaidToRestaurant: z
    .string({
      required_error: "Rider paid to restaurant is required",
      invalid_type_error: "Rider paid to restaurant would be string",
    })
    .optional(),
  proofImage: z
    .string({
      required_error: "Proof image is required",
      invalid_type_error: "Proof image would be string",
    })
    .optional(),
  orderStatus: z
    .string({
      required_error: "Order status is required",
      invalid_type_error: "Order status would be string",
    })
    .optional(),
  paymentMethod: z
    .string({
      required_error: "Payment Method is required",
      invalid_type_error: "Payment Method would be string",
    })
    .optional(),
  paymentStatus: z
    .string({
      required_error: "Payment Status is required",
      invalid_type_error: "Payment Status would be string",
    })
    .optional(),
  orderType: z.string({
    required_error: "Order type is required",
    invalid_type_error: "Order type would be string",
  }),
  promoCodeId: z
    .number({
      required_error: "Promo code is required",
      invalid_type_error: "Promo code id would be number",
    })
    .optional(),
  promoCodeAmount: z
    .string({
      required_error: "Promo code amount is required",
      invalid_type_error: "Promo code amount would be string",
    })
    .optional(),
  voucherId: z
    .number({
      required_error: "Voucher is required",
      invalid_type_error: "Voucher id would be number",
    })
    .optional(),
  voucherAmount: z
    .string({
      required_error: "Voucher amount is required",
      invalid_type_error: "Voucher amount would be string",
    })
    .optional(),
  walletAmount: z
    .string({
      required_error: "Wallet amount is required",
      invalid_type_error: "Wallet amount would be string",
    })
    .optional(),
  vat: z
    .string({
      required_error: "Vat is required",
      invalid_type_error: "Vat would be string",
    })
    .optional(),
  supplementaryDuty: z
    .string({
      required_error: "Supplementary duty is required",
      invalid_type_error: "Supplementary duty would be string",
    })
    .optional(),
  discountAmount: z
    .string({
      required_error: "Discount amount is required",
      invalid_type_error: "Discount amount would be string",
    })
    .optional(),
  deliveryCharge: z.string({
    required_error: "Delivery charge is required",
    invalid_type_error: "Delivery charge would be string",
  }),
  riderDeliveryCharge: z
    .string({
      required_error: "Rider delivery charge is required",
      invalid_type_error: "Rider delivery charge would be string",
    })
    .optional(),
  menuTotalAmount: z.string({
    required_error: "MenuTotal amount is required",
    invalid_type_error: "MenuTotal amount would be string",
  }),
  foodiCommissionRateInPercent: z.number({
    required_error: "Foodi Commission Rate is required",
    invalid_type_error: "Foodi Commission Rate would be number",
  }),
  foodiCommissionAmount: z.string({
    required_error: "Foodi Commission Amount is required",
    invalid_type_error: "Foodi Commission Amount would be string",
  }),
  totalAmount: z.string({
    required_error: "Total amount is required",
    invalid_type_error: "Total amount would be string",
  }),
  isCutleryNeeded: z
    .boolean({
      required_error: "IsCutleryNeeded is required",
      invalid_type_error: "IsCutleryNeeded would be boolean",
    })
    .optional(),
  isPreOrder: z
    .boolean({
      required_error: "IsPreOrder is required",
      invalid_type_error: "IsPreOrder would be boolean",
    })
    .optional(),
  preOrderDate: z
    .array(
      z
        .string({
          required_error: "Pre order date is required",
          invalid_type_error: "Pre order date would be boolean",
        })
        .optional(),
    )
    .optional(),
  isVerified: z
    .boolean({
      required_error: "IsVerified is required",
      invalid_type_error: "IsVerified would be boolean",
    })
    .optional(),
  isDelivered: z
    .boolean({
      required_error: "isDelivered is required",
      invalid_type_error: "isDelivered would be boolean",
    })
    .optional(),
  inProgress: z
    .boolean({
      required_error: "inProgress is required",
      invalid_type_error: "inProgress would be boolean",
    })
    .optional(),
  isActive: z
    .boolean({
      required_error: "IsActive is required",
      invalid_type_error: "IsActive would be boolean",
    })
    .optional(),
  deliveredAt: z
    .string()
    .datetime({
      message: "DeliveredAt is date",
    })
    .optional(),
  avgDeliveryTime: z
    .string({
      required_error: "AvgDeliveryTime is required",
      invalid_type_error: "AvgDeliveryTime would be string",
    })
    .optional(),
  highestRecipeTime: z.string({
    required_error: "HighestRecipeTime is required",
    invalid_type_error: "HighestRecipeTime would be string",
  }),
  riderArrivedRestaurantAt: z
    .string({
      required_error: "RiderArrivedRestaurantAt is required",
      invalid_type_error: "RiderArrivedRestaurantAt would be string",
    })
    .optional(),
  instruction: z
    .string({
      required_error: "Instruction is required",
      invalid_type_error: "Instruction would be string",
    })
    .optional(),
  menus: z.array(
    z.object({
      menuId: z.number({
        required_error: "MenuId is required",
        invalid_type_error: "MenuId would be number",
      }),
      name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name would be string",
      }),
      price: z.string({
        required_error: "Price is required",
        invalid_type_error: "Price would be string",
      }),
      quantity: z.number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity would be number",
      }),
      categoryId: z.number({
        required_error: "CategoryId is required",
        invalid_type_error: "CategoryId would be number",
      }),
      variation: z.string({
        required_error: "Variation is required",
        invalid_type_error: "Variation would be string",
      }),
      addons: z
        .array(
          z.object({
            addonId: z
              .number({
                required_error: "AddonId is required",
                invalid_type_error: "AddonId would be number",
              })
              .optional(),
            name: z
              .string({
                required_error: "Name is required",
                invalid_type_error: "Name would be string",
              })
              .optional(),
            price: z
              .string({
                required_error: "Price is required",
                invalid_type_error: "Price would be string",
              })
              .optional(),
            categoryId: z
              .number({
                required_error: "CategoryId is required",
                invalid_type_error: "CategoryId would be number",
              })
              .optional(),
          }),
        )
        .optional(),
    }),
  ),
});
