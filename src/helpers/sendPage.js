import express from "express";
import { sendData } from "./sendData";

/**
 * @typedef {Object} Page
 * @property {any[]} docs
 * @property {number} totalDocs
 * @property {number} limit
 * @property {number} page
 * @property {number} totalPages
 */

/**
 * @param {express.Response} res
 * @param {Page | Promise<Page>} page
 */
export function sendPage(res, page) {
  Promise.resolve(page).then((data) => {
    sendData(res, {
      items: data.docs || [],
      itemsPerPage: data.limit || 0,
      pageNumber: data.page || 0,
      totalItems: data.totalDocs || 0,
      totalPages: data.totalPages || 0,
    });
  });
}
