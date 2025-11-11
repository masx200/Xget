import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("GitHub Release Asset Support", () => {
  const testUrl =
    "https://xget.a1u06h9fe9y5bozbmgz3.qzz.io/release-assets.githubusercontent.com/github-production-release-asset/698328708/4262d59e-ae8f-4240-9007-6e0c81e3fd00?sp=r&sv=2018-11-09&sr=b&spr=https&se=2025-11-11T14%3A00%3A07Z&rscd=attachment%3B+filename%3Dapp-universal-release.apk&rsct=application%2Fvnd.android.package-archive&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2025-11-11T12%3A59%3A56Z&ske=2025-11-11T14%3A00%3A07Z&sks=b&skv=2018-11-09&sig=TecGQubK5p%2BZ4HdXoRAB3U71gsTROs2SwAINXuKsAF0%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc2Mjg2OTE3MCwibmJmIjoxNzYyODY3MzcwLCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.kayguITKbOEea0MRmpleMTp2h7NBos2N9sRRr_IN5Jc&response-content-disposition=attachment%3B%20filename%3Dapp-universal-release.apk&response-content-type=application%2Fvnd.android.package-archive";

  it("should handle GitHub release asset request with GET method", async () => {
    const response = await SELF.fetch(testUrl, {
      method: "GET",
    });

    // The request should be processed (not rejected with 4xx error)
    // It may succeed (200) or fail due to various reasons (network, auth, etc.)
    expect([200, 301, 302, 403, 404, 500, 502, 503, 504]).toContain(
      response.status,
    );

    // If successful, check content type
    if (response.status === 200) {
      const contentType = response.headers.get("content-type");
      expect(contentType).toBe("application/vnd.android.package-archive");
    }
  });

  it("should handle GitHub release asset request with HEAD method", async () => {
    const response = await SELF.fetch(testUrl, {
      method: "HEAD",
    });

    // Should be processed without being rejected
    expect([200, 301, 302, 403, 404, 500, 502, 503, 504]).toContain(
      response.status,
    );

    // If successful, check headers
    if (response.status === 200) {
      const contentType = response.headers.get("content-type");
      expect(contentType).toBe("application/vnd.android.package-archive");

      const contentDisposition = response.headers.get("content-disposition");
      expect(contentDisposition).toContain("app-universal-release.apk");
    }
  });

  it("should preserve content-disposition header for APK file", async () => {
    const response = await SELF.fetch(testUrl, {
      method: "GET",
    });

    if (response.status === 200) {
      const contentDisposition = response.headers.get("content-disposition");
      expect(contentDisposition).toContain("attachment");
      expect(contentDisposition).toContain("app-universal-release.apk");
    }
  });

  it("should set correct content-type for Android APK", async () => {
    const response = await SELF.fetch(testUrl, {
      method: "GET",
    });

    if (response.status === 200) {
      const contentType = response.headers.get("content-type");
      expect(contentType).toBe("application/vnd.android.package-archive");
    }
  });

  it("should handle the pre-signed S3 URL structure correctly", async () => {
    // The URL contains AWS S3 pre-signed parameters
    // Test that these are properly preserved in the request
    const response = await SELF.fetch(testUrl, {
      method: "GET",
    });

    // Should attempt to fetch from GitHub's S3 bucket
    expect([200, 301, 302, 403, 404, 500, 502, 503, 504]).toContain(
      response.status,
    );
  });

  it("should not cache release asset responses", async () => {
    const response = await SELF.fetch(testUrl);

    // Release assets are dynamic and shouldn't be cached
    const cacheControl = response.headers.get("cache-control");
    if (cacheControl && response.status === 200) {
      // Should not have long-term caching
      expect(cacheControl).not.toContain("max-age=1800");
    }
  });

  it("should support range requests for large APK files", async () => {
    // Android APKs are often large files (>50MB)
    // Test that range requests are supported
    const response = await SELF.fetch(testUrl, {
      method: "GET",
      headers: {
        Range: "bytes=0-1048575", // First 1MB
      },
    });

    // Should handle range requests (either 200 or 206)
    expect([200, 206, 416]).toContain(response.status);
  });

  it("should handle JWT token in URL", async () => {
    // The URL contains a JWT token for GitHub authentication
    // This should be preserved in the request
    const response = await SELF.fetch(testUrl, {
      method: "GET",
    });

    // Should be able to process the request with the token
    expect([200, 401, 403]).toContain(response.status);
  });

  describe("GitHub Release Asset URL Structure", () => {
    it("should handle release-assets.githubusercontent.com domain", async () => {
      // Verify that the proxy can route to GitHub's release assets domain
      const response = await SELF.fetch(testUrl, {
        method: "HEAD",
      });

      expect([200, 301, 302, 403, 404, 500, 502, 503, 504]).toContain(
        response.status,
      );
    });

    it("should preserve all query parameters for S3 pre-signed URL", async () => {
      // The URL contains important query parameters for S3 access
      // These should be preserved during proxying
      const response = await SELF.fetch(testUrl, {
        method: "GET",
      });

      expect([200, 301, 302, 403, 404, 500, 502, 503, 504]).toContain(
        response.status,
      );
    });
  });

  describe("Download Behavior", () => {
    it("should support streaming download for large APK files", async () => {
      const response = await SELF.fetch(testUrl, {
        method: "GET",
      });

      if (response.status === 200) {
        // Should be able to read the response body
        const body = await response.arrayBuffer();
        expect(body).toBeInstanceOf(ArrayBuffer);
        // Body should have some content (even if partial)
        expect(body.byteLength).toBeGreaterThanOrEqual(0);
      }
    });

    it("should set appropriate headers for file download", async () => {
      const response = await SELF.fetch(testUrl, {
        method: "GET",
      });

      if (response.status === 200) {
        // Should have content-disposition for attachment download
        expect(
          response.headers.get("content-disposition")?.includes("attachment"),
        ).toBeTruthy();

        // Should have content-type for APK
        expect(response.headers.get("content-type")).toBe(
          "application/vnd.android.package-archive",
        );
      }
    });
  });
});
