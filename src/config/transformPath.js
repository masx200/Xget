import { PLATFORMS } from "./platforms.js";

/**
 * Unified path transformation function
 * @param {string} path - The original path
 * @param {string} platformKey - The platform key
 * @returns {string} - The transformed path
 */

export function transformPath(path, platformKey) {
  if (!PLATFORMS[platformKey]) {
    return path;
  }

  const prefix = `/${platformKey.replace(/-/g, "/")}/`;
  let transformedPath = path.replace(
    new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
    "/"
  );

  // Special handling for crates.io API paths
  if (platformKey === "crates") {
    // Transform paths to include the API prefix
    if (transformedPath.startsWith("/")) {
      // Handle different API endpoints:
      // /serde/1.0.0/download -> /api/v1/crates/serde/1.0.0/download
      // /serde -> /api/v1/crates/serde
      // /?q=query -> /api/v1/crates?q=query
      if (transformedPath === "/" || transformedPath.startsWith("/?")) {
        // Search endpoint
        transformedPath = transformedPath.replace("/", "/api/v1/crates");
      } else {
        // Crate-specific endpoints
        transformedPath = `/api/v1/crates${transformedPath}`;
      }
    }
  }

  // Special handling for Homebrew API paths
  if (platformKey === "homebrew-api") {
    // Transform paths for Homebrew API endpoints
    if (transformedPath.startsWith("/")) {
      // Handle different API endpoints:
      // /formula/git.json -> /formula/git.json
      // /cask/docker.json -> /cask/docker.json
      // Keep the API paths as-is since they're already correct
      return transformedPath;
    }
  }

  // Special handling for Homebrew bottles
  if (platformKey === "homebrew-bottles") {
    // Transform paths for Homebrew bottles
    if (transformedPath.startsWith("/")) {
      // Transform bottle paths to ghcr.io container registry format
      // /v2/homebrew/core/git/manifests/2.39.0 -> /v2/homebrew/core/git/manifests/2.39.0
      return transformedPath;
    }
  }

  // Special handling for Jenkins plugins
  if (platformKey === "jenkins") {
    // Transform paths for Jenkins update center and plugin downloads
    if (transformedPath.startsWith("/")) {
      // Handle different Jenkins endpoints:
      // /update-center.json -> /current/update-center.json
      // /update-center.actual.json -> /current/update-center.actual.json
      // /experimental/update-center.json -> /experimental/update-center.json
      // /download/plugins/... -> /download/plugins/...
      if (transformedPath === "/update-center.json") {
        return "/current/update-center.json";
      } else if (transformedPath === "/update-center.actual.json") {
        return "/current/update-center.actual.json";
      } else if (transformedPath.startsWith("/experimental/") ||
        transformedPath.startsWith("/download/") ||
        transformedPath.startsWith("/current/")) {
        // Keep experimental, download, and current paths as-is
        return transformedPath;
      } else {
        // For other paths, assume they are relative to current
        return `/current${transformedPath}`;
      }
    }
  }

  // Special handling for Homebrew repositories
  if (platformKey === "homebrew") {
    // Transform paths for Homebrew Git repositories
    if (transformedPath.startsWith("/")) {
      // Handle different repository endpoints:
      // /brew -> /brew
      // /homebrew-core -> /homebrew-core
      // /homebrew-cask -> /homebrew-cask
      return transformedPath;
    }
  }

  // Special handling for GitHub assets domains (release-assets.githubusercontent.com, raw.githubusercontent.com)
  if (platformKey.includes(".")) {
    // For platforms with dots (like GitHub domains), no additional transformation needed
    // The path has already been cleaned by the caller
    return transformedPath;
  }

  return transformedPath;
}
