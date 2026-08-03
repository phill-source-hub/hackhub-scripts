import { scanTarget, analyzeScanResults, ScanResult } from "./networkScanner";

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
        .toThrow("Invalid IP address");
    });

    it("should handle deep scan option", async () => {
      const result = await scanTarget("192.168.1.1", { deepScan: true });
      
      expect(result.vulnerabilities.length).toBeGreaterThan(0);
    });

    it("should respect custom timeout option", async () => {
      const startTime = Date.now();
      await scanTarget("192.168.1.1", { timeout: 1000 });
      const elapsed = Date.now() - startTime;
      
      expect(elapsed).toBeLessThan(5000);
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
  });
});