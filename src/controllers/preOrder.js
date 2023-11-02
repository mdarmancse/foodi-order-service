// @ts-nocheck
import asyncHandler from "express-async-handler";
import { Order } from "../models";
import { sendData, sendPage } from "helpers";
import axios from "axios";
import { getMenusByMenuIdsForPriceInfoAsync } from "../grpc";

/**
 * Get All Pre-Order
 */
export const getPreOrders = asyncHandler(async (req, res) => {
  const results = await Order.getPreOrderPage(req);
  sendPage(res, results);
});

/**
 * Pre-Order Details
 */
export const getPreOrderDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const preOrder = await Order.findOne({ _id: id });

  const menuIds = preOrder.menus.map((d) => d.menuId).flat();

  // Call Restaurant Service For Item Current Price and Update this Order With this price
  const currentMenusPrices = await getMenusByMenuIdsForPriceInfoAsync(menuIds);

  // Create a map of ID to Price from the currentMenusPrices
  const idToPriceMap = currentMenusPrices.MenuPriceForOrder.reduce(
    (map, obj) => {
      map[obj.Id] = obj.Price.toString();
      return map;
    },
    {},
  );
  // Update Price values in the preOrder menus using the map
  const updatedMenu = preOrder.menus.map((menu) => ({
    ...menu.toObject(),
    price: idToPriceMap[menu.menuId],
  }));

  await Order.updateOne(
    { _id: id },
    {
      $set: {
        menus: updatedMenu,
      },
    },
  );

  const updatedOrder = await Order.findOne({ _id: id });

  sendData(res, updatedOrder);
});
