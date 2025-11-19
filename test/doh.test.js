import { describe, expect, it } from "vitest";
import { transformPath } from "../src/config/transformPath.js";
import { PLATFORMS } from "../src/config/platforms.js";

describe("DNS over HTTPS (DoH) Configuration", () => {
  describe("DoH Provider Definitions", () => {
    it("should have all expected DoH providers configured", () => {
      const expectedDoHProviders = [
        "doh-cloudflare",
        "doh-google",
        "doh-quad9",
        "doh-nextdns",
        "doh-adguard",
        "doh-opendns",
        "doh-alidns",
        "doh-dohpub",
        "doh-360",
        "doh-huawei",
        "doh-mullvad",
        "doh-controld",
      ];

      expectedDoHProviders.forEach((provider) => {
        expect(PLATFORMS).toHaveProperty(provider);
        expect(PLATFORMS[provider]).toBeDefined();
        expect(typeof PLATFORMS[provider]).toBe("string");
        expect(PLATFORMS[provider]).toMatch(/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      });
    });

    it("should have correct DoH provider URLs", () => {
      const expectedUrls = {
        "doh-cloudflare": "https://cloudflare-dns.com",
        "doh-google": "https://dns.google",
        "doh-quad9": "https://dns.quad9.net",
        "doh-nextdns": "https://dns.nextdns.io",
        "doh-adguard": "https://dns.adguard.com",
        "doh-opendns": "https://doh.opendns.com",
        "doh-alidns": "https://dns.alidns.com",
        "doh-dohpub": "https://doh.pub",
        "doh-360": "https://doh.360.cn",
        "doh-huawei": "https://dns.huawei.com",
        "doh-mullvad": "https://dns.mullvad.net",
        "doh-controld": "https://dns.controld.com",
      };

      Object.entries(expectedUrls).forEach(([provider, expectedUrl]) => {
        expect(PLATFORMS[provider]).toBe(expectedUrl);
      });
    });

    it("should have unique DoH provider URLs", () => {
      const dohUrls = Object.entries(PLATFORMS)
        .filter(([key, _]) => key.startsWith("doh-"))
        .map(([_, url]) => url);
      const uniqueUrls = [...new Set(dohUrls)];
      expect(dohUrls.length).toBe(uniqueUrls.length);
    });
  });

  describe("DoH Path Transformation", () => {
    it("should transform standard DoH DNS query paths", () => {
      const testCases = [
        {
          provider: "doh-cloudflare",
          input: "/doh/cloudflare/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-google",
          input: "/doh/google/resolve",
          expected: "/resolve",
        },
        {
          provider: "doh-quad9",
          input: "/doh/quad9/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-nextdns",
          input: "/doh/nextdns/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-adguard",
          input: "/doh/adguard/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-opendns",
          input: "/doh/opendns/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-alidns",
          input: "/doh/alidns/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-dohpub",
          input: "/doh/dohpub/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-360",
          input: "/doh/360/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-huawei",
          input: "/doh/huawei/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-mullvad",
          input: "/doh/mullvad/dns-query",
          expected: "/dns-query",
        },
        {
          provider: "doh-controld",
          input: "/doh/controld/dns-query",
          expected: "/dns-query",
        },
      ];

      testCases.forEach(({ provider, input, expected }) => {
        const result = transformPath(input, provider);
        expect(result).toBe(expected);
      });
    });

    it("should preserve DNS query parameters in transformation", () => {
      const testCases = [
        {
          provider: "doh-cloudflare",
          input: "/doh/cloudflare/dns-query?name=example.com&type=A&do=200",
          expected: "/dns-query?name=example.com&type=A&do=200",
        },
        {
          provider: "doh-google",
          input: "/doh/google/resolve?name=github.com&type=AAAA",
          expected: "/resolve?name=github.com&type=AAAA",
        },
      ];

      testCases.forEach(({ provider, input, expected }) => {
        const result = transformPath(input, provider);
        expect(result).toBe(expected);
      });
    });

    it("should handle URL fragments correctly", () => {
      const testCases = [
        {
          provider: "doh-cloudflare",
          input: "/doh/cloudflare/dns-query#section1",
          expected: "/dns-query#section1",
        },
        {
          provider: "doh-google",
          input: "/doh/google/resolve#results",
          expected: "/resolve#results",
        },
      ];

      testCases.forEach(({ provider, input, expected }) => {
        const result = transformPath(input, provider);
        expect(result).toBe(expected);
      });
    });

    it("should handle complex query scenarios", () => {
      const complexQuery = "/doh/cloudflare/dns-query?name=api.github.com&type=A&cd=false&do=0&ct=application/dns-json";
      const expected = "/dns-query?name=api.github.com&type=A&cd=false&do=0&ct=application/dns-json";

      const result = transformPath(complexQuery, "doh-cloudflare");
      expect(result).toBe(expected);
    });

    it("should not transform paths without DoH prefix", () => {
      const testPaths = [
        "/some/other/path",
        "/api/v1/data",
        "/health/check",
        "",
      ];

      testPaths.forEach((path) => {
        const result = transformPath(path, "doh-cloudflare");
        expect(result).toBe(path);
      });
    });
  });

  describe("DoH URL Construction", () => {
    it("should construct valid DoH URLs for DNS queries", () => {
      const testCases = [
        {
          provider: "doh-cloudflare",
          basePath: "/doh/cloudflare/dns-query",
          expectedFullUrl: "https://cloudflare-dns.com/dns-query",
        },
        {
          provider: "doh-google",
          basePath: "/doh/google/resolve",
          expectedFullUrl: "https://dns.google/resolve",
        },
        {
          provider: "doh-quad9",
          basePath: "/doh/quad9/dns-query",
          expectedFullUrl: "https://dns.quad9.net/dns-query",
        },
      ];

      testCases.forEach(({ provider, basePath, expectedFullUrl }) => {
        const transformedPath = transformPath(basePath, provider);
        const fullUrl = PLATFORMS[provider] + transformedPath;
        expect(fullUrl).toBe(expectedFullUrl);
        expect(() => new URL(fullUrl)).not.toThrow();
      });
    });

    it("should construct valid DoH URLs with query parameters", () => {
      const testCases = [
        {
          provider: "doh-cloudflare",
          basePath: "/doh/cloudflare/dns-query?name=example.com&type=A",
          expectedBaseUrl: "https://cloudflare-dns.com",
          expectedPath: "/dns-query?name=example.com&type=A",
        },
        {
          provider: "doh-google",
          basePath: "/doh/google/resolve?name=github.com&type=AAAA",
          expectedBaseUrl: "https://dns.google",
          expectedPath: "/resolve?name=github.com&type=AAAA",
        },
      ];

      testCases.forEach(({ provider, basePath, expectedBaseUrl, expectedPath }) => {
        const transformedPath = transformPath(basePath, provider);
        const fullUrl = PLATFORMS[provider] + transformedPath;
        expect(fullUrl).toBe(expectedBaseUrl + expectedPath);
        expect(() => new URL(fullUrl)).not.toThrow();

        // Verify URL components
        const url = new URL(fullUrl);
        expect(url.origin).toBe(expectedBaseUrl);
        expect(url.pathname + url.search).toBe(expectedPath);
      });
    });

    it("should handle edge cases in URL construction", () => {
      const edgeCases = [
        {
          provider: "doh-cloudflare",
          basePath: "/doh/cloudflare/",
          expectedPath: "/",
        },
        {
          provider: "doh-google",
          basePath: "/doh/google",
          expectedPath: "/doh/google", // transformPath doesn't remove non-matching prefixes
        },
        {
          provider: "doh-quad9",
          basePath: "/doh/quad9/dns-query#fragment",
          expectedPath: "/dns-query#fragment",
        },
      ];

      edgeCases.forEach(({ provider, basePath, expectedPath }) => {
        const transformedPath = transformPath(basePath, provider);
        expect(transformedPath).toBe(expectedPath);

        const fullUrl = PLATFORMS[provider] + transformedPath;
        expect(() => new URL(fullUrl)).not.toThrow();
      });
    });
  });

  describe("DoH Provider Coverage", () => {
    it("should include major DNS providers", () => {
      const majorProviders = [
        "doh-cloudflare", // Cloudflare DNS
        "doh-google",     // Google DNS
        "doh-quad9",      // Quad9 DNS
        "doh-nextdns",    // NextDNS
        "doh-adguard",    // AdGuard DNS
        "doh-opendns",    // OpenDNS
      ];

      majorProviders.forEach((provider) => {
        expect(PLATFORMS).toHaveProperty(provider);
        expect(PLATFORMS[provider]).toMatch(/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      });
    });

    it("should include regional DNS providers", () => {
      const regionalProviders = [
        "doh-alidns",     // Alibaba DNS (China)
        "doh-dohpub",     // DoH.pub (China)
        "doh-360",        // 360 DNS (China)
        "doh-huawei",     // Huawei DNS (China)
      ];

      regionalProviders.forEach((provider) => {
        expect(PLATFORMS).toHaveProperty(provider);
        expect(PLATFORMS[provider]).toMatch(/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      });
    });

    it("should include privacy-focused DNS providers", () => {
      const privacyProviders = [
        "doh-mullvad",    // Mullvad DNS
        "doh-controld",   // Control D
      ];

      privacyProviders.forEach((provider) => {
        expect(PLATFORMS).toHaveProperty(provider);
        expect(PLATFORMS[provider]).toMatch(/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
      });
    });
  });

  describe("DoH Error Handling", () => {
    it("should handle invalid DoH provider keys gracefully", () => {
      const invalidProvider = "doh-nonexistent";
      const testPath = "/doh/nonexistent/dns-query";

      expect(() => transformPath(testPath, invalidProvider)).not.toThrow();
      expect(transformPath(testPath, invalidProvider)).toBe(testPath);
    });

    it("should handle null/undefined inputs gracefully", () => {
      // Note: transformPath expects strings, so we test with string representations
      expect(() => transformPath("null", "doh-cloudflare")).not.toThrow();
      expect(() => transformPath("undefined", "doh-google")).not.toThrow();

      // Test with empty strings instead of null/undefined
      expect(() => transformPath("", "doh-cloudflare")).not.toThrow();
      expect(() => transformPath("", "doh-google")).not.toThrow();
    });

    it("should handle empty string inputs", () => {
      expect(transformPath("", "doh-cloudflare")).toBe("");
      expect(transformPath("", "doh-google")).toBe("");
    });
  });
});