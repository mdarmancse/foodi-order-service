export const InfoLog = "info";
export const DebugLog = "debug";
export const WarningLog = "warning";
export const ErrorLog = "error";

/**
 * @typedef {Object} Log
 * @property {string} [service]
 * @property {'info' | 'debug' | 'warning' | 'error'} [level]
 * @property {string} [timestamp]
 * @property {string} [path]
 * @property {string} [query]
 * @property {string} [method]
 * @property {string} [message]
 * @property {string} [extra]
 * @property {string} [useragent]
 * @property {string} [ip]
 * @property {string} [caller]
 * @property {number} [status]
 * @property {number} [latency]
 */

const ServiceName = "order-service";

/**
 * Log message
 * @param {Log} args
 */
export function log(args) {
  let objs = args;
  if (!objs.level) {
    objs.level = InfoLog;
  }
  objs.service = ServiceName;
  if (!objs.timestamp) {
    objs.timestamp = new Date().toISOString();
  }

  console.error(JSON.stringify(objs));
}
