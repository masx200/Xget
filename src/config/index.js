import { PLATFORMS } from "./PLATFORMS.1.js";

/**
 * @typedef {Object} SecurityConfig
 * @property {string[]} ALLOWED_METHODS - List of allowed HTTP methods
 * @property {string[]} ALLOWED_ORIGINS - List of allowed CORS origins
 * @property {number} MAX_PATH_LENGTH - Maximum allowed URL path length
 */

/**
 * @typedef {Object} ApplicationConfig
 * @property {number} TIMEOUT_SECONDS - Request timeout in seconds
 * @property {number} MAX_RETRIES - Maximum number of retry attempts
 * @property {number} RETRY_DELAY_MS - Delay between retries in milliseconds
 * @property {number} CACHE_DURATION - Cache duration in seconds
 * @property {SecurityConfig} SECURITY - Security-related configurations
 * @property {Object.<string, string>} PLATFORMS - Platform-specific configurations
 */

/**
 * Creates configuration with environment variable overrides
 * @param {Record<string, any>} env - Environment variables (Cloudflare Workers env object)
 * @returns {ApplicationConfig} Application configuration
 */
export function createConfig(env = {}) {
  return {
    TIMEOUT_SECONDS: parseInt(env.TIMEOUT_SECONDS) || 30,
    MAX_RETRIES: parseInt(env.MAX_RETRIES) || 3,
    RETRY_DELAY_MS: parseInt(env.RETRY_DELAY_MS) || 1000,
    CACHE_DURATION: parseInt(env.CACHE_DURATION) || 1800, // 30 minutes
    SECURITY: {
      ALLOWED_METHODS: env.ALLOWED_METHODS
        ? env.ALLOWED_METHODS.split(",")
        : ["GET", "HEAD","POST"],
      ALLOWED_ORIGINS: env.ALLOWED_ORIGINS
        ? env.ALLOWED_ORIGINS.split(",")
        : ["*"],
      MAX_PATH_LENGTH: parseInt(env.MAX_PATH_LENGTH) || 2048,
    },
    PLATFORMS,
  };
}

/** @type {ApplicationConfig} */
export const CONFIG = createConfig();
