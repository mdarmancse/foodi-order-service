import express, { Router } from "express";
import { authenticate, singleUpload, validateBody } from "middlewares";
import {
  OrderSchema,
  AmountThresholdSchema,
  OrderThresholdSchema,
} from "validators";
import {
  addToCart,
  updateToCart,
  placeOrder,
  getOrders,
  getOrderDetails,
  paymentStatusUpdate,
  orderAdminAccept,
  orderRestaurantAccept,
  orderRiderAccept,
  orderUpdate,
  getUserOrders,
  getRestaurantOrders,
  getRiderOrders,
  getRestaurantsLatLongWithZoneAndDateTime,
  getRestaurantOrdersPerformance,
  getRestaurantAcceptedOrders,
  getRestaurantRejectedOrders,
  createOrder,
} from "./orders";
import {
  getOrderThresholds,
  createOrderThreshold,
  updateOrderThreshold,
  getOrderThresholdDetails,
  deleteOrderThreshold,
} from "./orderThresholds";
import {
  getAmountThresholds,
  createAmountThreshold,
  updateAmountThreshold,
  getAmountThresholdDetails,
  deleteAmountThreshold,
} from "./AmountThresholds";
import { getStatusHistories, getOrderStatusHistories } from "./statusHistories";
import { getUserInvoice, getRiderInvoice } from "./invoice";
import { getPreOrderDetails, getPreOrders } from "./preOrder";

/**
 * @param {express.Express} app
 */
export function initRoutes(app) {
  const router = Router();

  /**
   * Order Thresholds Routes
   */
  router
    .route("/order-thresholds")
    .get(authenticate, getOrderThresholds)
    .post(
      authenticate,
      validateBody(OrderThresholdSchema),
      createOrderThreshold,
    );

  router
    .route("/order-thresholds/:id")
    .get(authenticate, getOrderThresholdDetails)
    .patch(
      authenticate,
      validateBody(OrderThresholdSchema),
      updateOrderThreshold,
    )
    .delete(deleteOrderThreshold);

  /**
   * Amount Thresholds Routes
   */
  router
    .route("/amount-thresholds")
    .get(authenticate, getAmountThresholds)
    .post(
      authenticate,
      validateBody(AmountThresholdSchema),
      createAmountThreshold,
    );

  router
    .route("/amount-thresholds/:id")
    .get(authenticate, getAmountThresholdDetails)
    .patch(
      authenticate,
      validateBody(AmountThresholdSchema),
      updateAmountThreshold,
    )
    .delete(deleteAmountThreshold);

  /**
   * Status History
   */
  router.route("/status-histories").get(authenticate, getStatusHistories);

  /**
   * Pre-Orders
   */
  router.route("/pre-orders").get(authenticate, getPreOrders);
  router.route("/pre-orders/:id").get(authenticate, getPreOrderDetails);

  /**
   * Order Invoice
   */
  router.route("/user-invoice/:id").get(authenticate, getUserInvoice);
  router.route("/rider-invoice/:id").get(authenticate, getRiderInvoice);

  /**
   * Order Routes
   */
  router
    .route("/cart")
    .post(authenticate, validateBody(OrderSchema), addToCart);

  router
    .route("/cart/:id")
    .patch(authenticate, validateBody(OrderSchema), updateToCart);

  router.route("/place/:id").patch(authenticate, placeOrder);

  router
    .route("/")
    .get(authenticate, getOrders)
    .post(authenticate, validateBody(OrderSchema), createOrder);

  router.route("/payment/:id").patch(authenticate, paymentStatusUpdate);
  router
    .route("/status-histories/:id")
    .get(authenticate, getOrderStatusHistories);

  router.route("/user-orders/:userId").get(authenticate, getUserOrders);
  router.route("/rider-orders/:riderId").get(authenticate, getRiderOrders);
  router
    .route("/restaurant-orders/:branchId")
    .get(authenticate, getRestaurantOrders);

  router
    .route("/restaurant-accepted-orders/:branchId")
    .get(authenticate, getRestaurantAcceptedOrders);

  router
    .route("/restaurant-rejected-orders/:branchId")
    .get(authenticate, getRestaurantRejectedOrders);

  router
    .route("/restaurants-lat-long")
    .get(authenticate, getRestaurantsLatLongWithZoneAndDateTime);
  router
    .route("/restaurant-orders-performance/:branchId")
    .get(authenticate, getRestaurantOrdersPerformance);

  router.route("/admin-accept/:id").patch(authenticate, orderAdminAccept);
  router
    .route("/restaurant-accept/:id")
    .patch(authenticate, orderRestaurantAccept);
  router
    .route("/rider-action/:id")
    .patch(authenticate, singleUpload("proofImage"), orderRiderAccept);

  router.route("/:id").get(authenticate, getOrderDetails);
  router
    .route("/:id")
    .patch(authenticate, validateBody(OrderSchema), orderUpdate);

  app.use(router);
}
