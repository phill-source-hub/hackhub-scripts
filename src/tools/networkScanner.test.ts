import {
  scanTarget,
  analyzeScanResults,
  ScanResult,
  ValidationError
} from "./networkScanner";

describe("Network Scanner Tool", () => {
  describe("scanTarget", () => {
    it("should successfully scan a valid IP", async () => {
      const result = await scanTarget("192.168.1.1");

      expect(result).toHaveProperty("ip");
      expect(result).toHaveProperty("openPorts");
      expect(result).toHaveProperty("services");
      expect(result.ip).toBe("192.168.1.1");
    });

    it("should reject invalid IP addresses", async () => {
      await expect(scanTarget("999.999.999.999"))
        .rejects
        .toThrow(ValidationError);
    });

    it("should reject empty string", async () => {
      await expect(scanTarget(""))
        .rejects
        .toThrow(ValidationError);
    });

    it("should reject null input", async () => {
      await expect(scanTarget(null as unknown as string))
        .rejects
        .toThrow(ValidationError);
    });

    it("should trim whitespace from IP", async () => {
      const result = await scanTarget("  192.168.1.1  ");
      expect(result.ip).toBe("192.168.1.1");
    });

    it("should handle deep scan option", async () => {
      const result = await scanTarget("192.168.1.1", { deepScan: true });

      expect(result.vulnerabilities.length).toBeGreaterThan(0);
    });

    it("should reject invalid deepScan option", async () => {
      await expect(scanTarget("192.168.1.1", { deepScan: "true" as unknown as boolean }))
        .rejects
        .toThrow(ValidationError);
    });

    it("should reject negative timeout", async () => {
      await expect(scanTarget("192.168.1.1", { timeout: -1000 }))
        .rejects
        .toThrow(ValidationError);
    });

    it("should reject invalid retries", async () => {
      await expect(scanTarget("192.168.1.1", { retries: 1.5 }))
        .rejects
        .toThrow(ValidationError);
    });

    it("should respect custom timeout option", async () => {
      const startTime = Date.now();
      await scanTarget("192.168.1.1", { timeout: 1000 });
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(5000);
    });

    it("should retry on failure", async () => {
      const result = await scanTarget("192.168.1.1", { retries: 2 });
      expect(result.ip).toBe("192.168.1.1");
    });
  });

  describe("analyzeScanResults", () => {
    it("should identify vulnerabilities", () => {
      const mockResult: ScanResult = {
        ip: "192.168.1.1",
        openPorts: [22, 80],
        services: ["ssh", "http"],
        vulnerabilities: ["CVE-2024-1234", "CVE-2024-5678"]
      };

      const threats = analyzeScanResults(mockResult);

      expect(threats).toContain("Found 2 vulnerabilities");
    });

    it("should flag excessive open ports", () => {
      const mockResult: ScanResult = {
        ip: "192.168.1.1",
        openPorts: [20, 21, 22, 23, 80, 443, 3389],
        services: Array(7).fill("various"),
        vulnerabilities: []
      };

      const threats = analyzeScanResults(mockResult);

      expect(threats).toContain("Unusually high number of open ports");
    });

    it("should return empty array for clean scan", () => {
      const mockResult: ScanResult = {
        ip: "192.168.1.1",
        openPorts: [22],
        services: ["ssh"],
        vulnerabilities: []
      };

      const threats = analyzeScanResults(mockResult);

      expect(threats.length).toBe(0);
    });

    it("should throw on null result", () => {
      expect(() => analyzeScanResults(null)).toThrow(ValidationError);
    });

    it("should throw on undefined result", () => {
      expect(() => analyzeScanResults(undefined)).toThrow(ValidationError);
    });

    it("should throw on non-object result", () => {
      expect(() => analyzeScanResults("not an object" as unknown as ScanResult)).toThrow(
        ValidationError
      );
    });

    it("should throw on invalid vulnerabilities array", () => {
      const mockResult = {
        ip: "192.168.1.1",
        openPorts: [22],
        services: ["ssh"],
        vulnerabilities: "not an array"
      } as unknown as ScanResult;

      expect(() => analyzeScanResults(mockResult)).toThrow(ValidationError);
    });

    it("should throw on invalid openPorts array", () => {
      const mockResult = {
        ip: "192.168.1.1",
        openPorts: "not an array",
        services: ["ssh"],
        vulnerabilities: []
      } as unknown as ScanResult;

      expect(() => analyzeScanResults(mockResult)).toThrow(ValidationError);
    });
  });
});