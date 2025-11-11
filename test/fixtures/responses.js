/**
 * Mock response fixtures for testing
 */

export const MOCK_RESPONSES = {
  github: {
    packageJson: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "max-age=300",
      },
      body: JSON.stringify({
        name: "vscode",
        version: "1.85.0",
        description: "Visual Studio Code",
        main: "./out/main.js",
        scripts: {
          test: "npm test",
        },
      }),
    },

    readme: {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: "# Visual Studio Code\n\nCode editing. Redefined.",
    },

    release: {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": "123456789",
        "Content-Disposition": 'attachment; filename="vscode-1.85.0.zip"',
      },
      body: "binary-data-placeholder",
    },

    notFound: {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Not Found",
    },

    gitInfoRefs: {
      status: 200,
      headers: {
        "Content-Type": "application/x-git-upload-pack-advertisement",
        "Cache-Control": "no-cache",
      },
      body: "001e# service=git-upload-pack\n0000009144b8c8cf...",
    },
  },

  gitlab: {
    packageJson: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "gitlab",
        version: "16.0.0",
        description: "GitLab Community Edition",
      }),
    },

    archive: {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="gitlab-master.zip"',
      },
      body: "zip-data-placeholder",
    },
  },

  huggingface: {
    modelConfig: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        architectures: ["GPT2LMHeadModel"],
        model_type: "gpt2",
        vocab_size: 50257,
        n_positions: 1024,
        n_ctx: 1024,
        n_embd: 1024,
        n_layer: 24,
        n_head: 16,
      }),
    },

    modelFile: {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": "987654321",
      },
      body: "model-binary-data-placeholder",
    },

    datasetFile: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          { question: "What is AI?", answer: "Artificial Intelligence..." },
          { question: "What is ML?", answer: "Machine Learning..." },
        ],
      }),
    },
  },

  npm: {
    packageMetadata: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "react",
        version: "18.2.0",
        description:
          "React is a JavaScript library for building user interfaces.",
        main: "index.js",
        repository: {
          type: "git",
          url: "https://github.com/facebook/react.git",
        },
        keywords: ["react", "javascript", "ui"],
        license: "MIT",
      }),
    },

    packageTarball: {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="react-18.2.0.tgz"',
      },
      body: "tarball-data-placeholder",
    },
  },

  pypi: {
    simpleIndex: {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: `<!DOCTYPE html>
<html>
<head><title>Links for requests</title></head>
<body>
<h1>Links for requests</h1>
<a href="../../packages/source/r/requests/requests-2.31.0.tar.gz">requests-2.31.0.tar.gz</a><br/>
<a href="../../packages/py3/r/requests/requests-2.31.0-py3-none-any.whl">requests-2.31.0-py3-none-any.whl</a><br/>
</body>
</html>`,
    },

    packageFile: {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="requests-2.31.0.tar.gz"',
      },
      body: "gzip-data-placeholder",
    },

    wheelFile: {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="requests-2.31.0-py3-none-any.whl"',
      },
      body: "wheel-data-placeholder",
    },
  },

  conda: {
    repodata: {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        info: {
          subdir: "linux-64",
        },
        packages: {
          "numpy-1.24.3-py311h08b1b3b_1.conda": {
            build: "py311h08b1b3b_1",
            build_number: 1,
            depends: ["python >=3.11,<3.12.0a0"],
            license: "BSD-3-Clause",
            name: "numpy",
            platform: "linux",
            subdir: "linux-64",
            timestamp: 1679932871000,
            version: "1.24.3",
          },
        },
      }),
    },

    packageFile: {
      status: 200,
      headers: {
        "Content-Type": "application/x-conda-package",
        "Content-Disposition":
          'attachment; filename="numpy-1.24.3-py311h08b1b3b_1.conda"',
      },
      body: "conda-package-data-placeholder",
    },
  },

  errors: {
    badRequest: {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Bad Request",
    },

    unauthorized: {
      status: 401,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Unauthorized",
    },

    forbidden: {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Forbidden",
    },

    notFound: {
      status: 404,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Not Found",
    },

    methodNotAllowed: {
      status: 405,
      headers: {
        "Content-Type": "text/plain",
        Allow: "GET, HEAD",
      },
      body: "Method Not Allowed",
    },

    pathTooLong: {
      status: 414,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "URI Too Long",
    },

    internalServerError: {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Internal Server Error",
    },

    badGateway: {
      status: 502,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Bad Gateway",
    },

    serviceUnavailable: {
      status: 503,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Service Unavailable",
    },

    gatewayTimeout: {
      status: 504,
      headers: {
        "Content-Type": "text/plain",
      },
      body: "Gateway Timeout",
    },
  },
};

/**
 * Create a Response object from mock data
 * @param {Object} mockData - Mock response data
 * @returns {Response} Response object
 */
export function createMockResponse(mockData) {
  return new Response(mockData.body, {
    status: mockData.status,
    statusText: getStatusText(mockData.status),
    headers: mockData.headers,
  });
}

/**
 * Get status text for HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} Status text
 */
function getStatusText(status) {
  const statusTexts = {
    200: "OK",
    201: "Created",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    414: "URI Too Long",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  return statusTexts[status] || "Unknown";
}

/**
 * Mock fetch function that returns predefined responses
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Mock response
 */
export function mockFetchWithFixtures(url, options = {}) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(
      () => {
        const urlObj = new URL(url);
        const path = urlObj.pathname;

        // Route to appropriate mock response based on URL pattern
        if (path.includes("/gh/") && path.includes("package.json")) {
          resolve(createMockResponse(MOCK_RESPONSES.github.packageJson));
        } else if (path.includes("/gh/") && path.includes("README.md")) {
          resolve(createMockResponse(MOCK_RESPONSES.github.readme));
        } else if (path.includes("/gl/") && path.includes("package.json")) {
          resolve(createMockResponse(MOCK_RESPONSES.gitlab.packageJson));
        } else if (path.includes("/hf/") && path.includes("config.json")) {
          resolve(createMockResponse(MOCK_RESPONSES.huggingface.modelConfig));
        } else if (path.includes("/npm/") && !path.includes(".tgz")) {
          resolve(createMockResponse(MOCK_RESPONSES.npm.packageMetadata));
        } else if (path.includes("/pypi/simple/")) {
          resolve(createMockResponse(MOCK_RESPONSES.pypi.simpleIndex));
        } else if (path.includes("/conda/") && path.includes("repodata.json")) {
          resolve(createMockResponse(MOCK_RESPONSES.conda.repodata));
        } else if (
          options.method && !["GET", "HEAD", "POST"].includes(options.method)
        ) {
          resolve(createMockResponse(MOCK_RESPONSES.errors.methodNotAllowed));
        } else if (path.length > 2048) {
          resolve(createMockResponse(MOCK_RESPONSES.errors.pathTooLong));
        } else {
          resolve(createMockResponse(MOCK_RESPONSES.errors.notFound));
        }
      },
      Math.random() * 50 + 10,
    ); // 10-60ms delay
  });
}
