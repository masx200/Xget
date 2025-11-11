/**
 * Test setup and global configuration
 */

import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";

// Global test configuration
const TEST_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 2,
  bail: false,
};

// Global test state
let testStartTime;
let testMetrics = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
};

/**
 * Global setup - runs once before all tests
 */
beforeAll(async () => {
  console.log("🚀 Starting Xget test suite...");
  testStartTime = Date.now();

  // Initialize test environment
  await setupTestEnvironment();

  // Verify test dependencies
  await verifyTestDependencies();

  console.log("✅ Test environment initialized");
});

/**
 * Global teardown - runs once after all tests
 */
afterAll(async () => {
  const duration = Date.now() - testStartTime;

  console.log("\n📊 Test Suite Summary:");
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Total: ${testMetrics.totalTests}`);
  console.log(`   Passed: ${testMetrics.passedTests}`);
  console.log(`   Failed: ${testMetrics.failedTests}`);
  console.log(`   Skipped: ${testMetrics.skippedTests}`);

  // Cleanup test environment
  await cleanupTestEnvironment();

  console.log("🏁 Test suite completed");
});

/**
 * Setup before each test
 */
beforeEach(async (context) => {
  testMetrics.totalTests++;

  // Reset any global state
  resetGlobalState();

  // Setup test-specific environment
  await setupTestCase(context);
});

/**
 * Cleanup after each test
 */
afterEach(async (context) => {
  // Update test metrics based on result
  if (context.meta?.result === "pass") {
    testMetrics.passedTests++;
  } else if (context.meta?.result === "fail") {
    testMetrics.failedTests++;
  } else if (context.meta?.result === "skip") {
    testMetrics.skippedTests++;
  }

  // Cleanup test-specific resources
  await cleanupTestCase(context);
});

/**
 * Setup test environment
 */
async function setupTestEnvironment() {
  // Verify Cloudflare Workers environment
  if (typeof globalThis.fetch === "undefined") {
    throw new Error("fetch is not available in test environment");
  }

  // Setup global test utilities
  globalThis.TEST_CONFIG = TEST_CONFIG;

  // Initialize performance monitoring
  if (typeof performance === "undefined") {
    globalThis.performance = {
      now: () => Date.now(),
    };
  }

  // Setup console overrides for testing
  setupConsoleOverrides();
}

/**
 * Verify test dependencies
 */
async function verifyTestDependencies() {
  const requiredGlobals = [
    "Request",
    "Response",
    "Headers",
    "URL",
    "URLSearchParams",
  ];

  for (const global of requiredGlobals) {
    if (typeof globalThis[global] === "undefined") {
      throw new Error(`Required global ${global} is not available`);
    }
  }

  // Verify SELF is available for Cloudflare Workers testing
  try {
    const { SELF } = await import("cloudflare:test");
    if (!SELF) {
      throw new Error("SELF is not available");
    }
  } catch (error) {
    console.warn("Warning: Cloudflare Workers test environment not available");
  }
}

/**
 * Setup console overrides for testing
 */
function setupConsoleOverrides() {
  const originalConsole = { ...console };

  // Store original console methods
  globalThis.originalConsole = originalConsole;

  // Override console methods for testing
  console.warn = (...args) => {
    if (process.env.NODE_ENV !== "test" || process.env.VERBOSE_TESTS) {
      originalConsole.warn(...args);
    }
  };

  console.log = (...args) => {
    if (process.env.NODE_ENV !== "test" || process.env.VERBOSE_TESTS) {
      originalConsole.log(...args);
    }
  };
}

/**
 * Reset global state between tests
 */
function resetGlobalState() {
  // Clear any cached data
  if (globalThis.testCache) {
    globalThis.testCache.clear();
  }

  // Reset performance counters
  if (globalThis.testPerformance) {
    globalThis.testPerformance.reset();
  }
}

/**
 * Setup individual test case
 */
async function setupTestCase(context) {
  // Create test-specific cache
  globalThis.testCache = new Map();

  // Setup test-specific performance monitoring
  globalThis.testPerformance = {
    marks: new Map(),
    mark: (name) => {
      globalThis.testPerformance.marks.set(name, performance.now());
    },
    measure: (name, startMark, endMark) => {
      const start = globalThis.testPerformance.marks.get(startMark) || 0;
      const end = globalThis.testPerformance.marks.get(endMark) ||
        performance.now();
      return end - start;
    },
    reset: () => {
      globalThis.testPerformance.marks.clear();
    },
  };

  // Mark test start time
  globalThis.testPerformance.mark("test-start");
}

/**
 * Cleanup individual test case
 */
async function cleanupTestCase(context) {
  // Mark test end time
  globalThis.testPerformance.mark("test-end");

  // Log test performance if verbose
  if (process.env.VERBOSE_TESTS) {
    const duration = globalThis.testPerformance.measure(
      "test-duration",
      "test-start",
      "test-end",
    );
    console.log(`Test "${context.meta?.name}" took ${duration.toFixed(2)}ms`);
  }

  // Cleanup test-specific resources
  if (globalThis.testCache) {
    globalThis.testCache.clear();
  }

  if (globalThis.testPerformance) {
    globalThis.testPerformance.reset();
  }
}

/**
 * Cleanup test environment
 */
async function cleanupTestEnvironment() {
  // Restore original console
  if (globalThis.originalConsole) {
    Object.assign(console, globalThis.originalConsole);
    delete globalThis.originalConsole;
  }

  // Cleanup global test utilities
  delete globalThis.TEST_CONFIG;
  delete globalThis.testCache;
  delete globalThis.testPerformance;
}

/**
 * Custom test utilities available globally
 */
globalThis.testUtils = {
  /**
   * Create a test timeout
   */
  timeout: (ms) =>
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Test timed out after ${ms}ms`)), ms);
    }),

  /**
   * Wait for a condition to be true
   */
  waitFor: async (condition, timeout = 5000, interval = 100) => {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  },

  /**
   * Retry a function with exponential backoff
   */
  retry: async (fn, maxRetries = 3, baseDelay = 100) => {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (i < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  },
};

// Export test configuration for use in other files
export { TEST_CONFIG, testMetrics };
