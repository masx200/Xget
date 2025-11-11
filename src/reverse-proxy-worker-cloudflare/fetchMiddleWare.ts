import { Env } from "./index.ts";
import { ReverseProxy } from "./ReverseProxy.ts";
import { transformPath } from "../config/transformPath.js";
import { PLATFORMS } from "../config/platforms.js";

export async function fetchMiddleWare(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  next: () => Promise<Response>,
): Promise<Response> {
  console.log(
    JSON.stringify(
      {
        request: {
          method: request.method,
          url: request.url,
          Headers: Object.fromEntries(request.headers),
        },
      },
      null,
      2,
    ),
  );

  const nextUrl = new URL(request.url);
  const pathname = nextUrl.pathname;

  // Handle platform-based proxy requests using transformPath
  // Check if the path starts with a known platform prefix
  const platformKey = extractPlatformFromPath(pathname);

  if (platformKey) {
    // Extract the platform prefix from the path
    let originalPath;
    if (platformKey.includes(".")) {
      // For platforms with dots (like GitHub domains), manually remove the platform segment
      const platformPrefix = `/${platformKey}/`;
      if (pathname.startsWith(platformPrefix)) {
        originalPath = pathname.substring(platformPrefix.length);
        if (!originalPath.startsWith("/")) {
          originalPath = "/" + originalPath;
        }
      } else {
        originalPath = pathname;
      }
    } else {
      // For normal platform keys with hyphens, use regex replacement
      const prefix = `/${platformKey.replace(/-/g, "/")}/`;
      originalPath = pathname.replace(
        new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`),
        "/"
      ) || "/";
    }

    // Get the base URL for this platform
    const baseUrl = PLATFORMS[platformKey];
    if (!baseUrl) {
      return next();
    }

    // Use transformPath to transform the original path
    const transformedPath = transformPath(originalPath, platformKey);

    // Construct the final URL
    const finalUrl = new URL(transformedPath, baseUrl);
    finalUrl.search = nextUrl.search;

    console.log({
      url: finalUrl.href,
      method: request.method,
      platformKey,
      originalPath,
      transformedPath,
      baseUrl
    });

    return await ReverseProxy(request, finalUrl);
  }

  return next();
}

/**
 * Extract platform key from URL path
 * @param pathname The URL pathname to extract platform from
 * @returns The platform key or null if not found
 */
function extractPlatformFromPath(pathname: string): string | null {
  // Split the path and check if the first segment matches a platform key
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  // Check for exact match first
  const firstSegment = segments[0];
  if (PLATFORMS[firstSegment]) {
    return firstSegment;
  }

  // Check for compound platform keys (like "cr-docker", "ip-openai", etc.)
  // Check up to 3 segments deep for compound keys
  for (let i = 2; i <= Math.min(3, segments.length); i++) {
    const possibleKey = segments.slice(0, i).join('-');
    if (PLATFORMS[possibleKey]) {
      return possibleKey;
    }
  }

  // Check for path-style platform keys (like "cr/docker" -> "cr-docker")
  for (let i = 1; i <= Math.min(2, segments.length); i++) {
    const possibleKey = segments.slice(0, i).join('/');
    if (PLATFORMS[possibleKey]) {
      return possibleKey;
    }
  }

  return null;
}

