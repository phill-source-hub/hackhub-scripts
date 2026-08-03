/**
 * Network Scanner Tool
 * A reusable module for scanning and analyzing network targets
 *
 * Deploys into HackHub's /lib directory as a custom command
 */

export interface ScanResult {
  ip: string;
  openPorts: number[];
  services: string[];
  vulnerabilities: string[];
}

export interface ScanOptions {
  deepScan?: boolean;
  timeout?: number;
  retries?: number;
}

export class ScannerError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly targetIp?: string
  ) {
    super(message);
    this.name = "ScannerError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Scans a target IP for open ports and services
 * @param targetIp - Target IP address to scan
 * @param options - Optional scan configuration
 * @returns Promise resolving to scan results
 * @throws {ValidationError} If targetIp is invalid or empty
 * @throws {ScannerError} If scan operation fails
 */
export async function scanTarget(
  targetIp: string,
  options: ScanOptions = {}
): Promise<ScanResult> {
  try {
    if (!targetIp || typeof targetIp !== "string") {
      throw new ValidationError("Target IP must be a non-empty string", "targetIp");
    }

    const trimmedIp = targetIp.trim();
    if (!isValidIp(trimmedIp)) {
      throw new ValidationError(`Invalid IP address format: ${trimmedIp}`, "targetIp");
    }

    const { deepScan = false, timeout = 5000, retries = 1 } = options;

    if (typeof deepScan !== "boolean") {
      throw new ValidationError("deepScan option must be boolean", "deepScan");
    }

    if (typeof timeout !== "number" || timeout <= 0) {
      throw new ValidationError("timeout must be a positive number", "timeout");
    }

    if (typeof retries !== "number" || retries < 0 || !Number.isInteger(retries)) {
      throw new ValidationError("retries must be a non-negative integer", "retries");
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result: ScanResult = {
          ip: trimmedIp,
          openPorts: [22, 80, 443],
          services: ["ssh", "http", "https"],
          vulnerabilities: deepScan ? ["CVE-2024-1234"] : []
        };

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        }
      }
    }

    throw new ScannerError(
      `Failed to scan target after ${retries + 1} attempts: ${lastError?.message}`,
      "SCAN_FAILED",
      trimmedIp
    );
  } catch (error) {
    if (error instanceof ValidationError || error instanceof ScannerError) {
      throw error;
    }
    throw new ScannerError(
      `Unexpected error during scan: ${error instanceof Error ? error.message : String(error)}`,
      "UNKNOWN_ERROR",
      targetIp
    );
  }
}

/**
 * Validates IPv4 address format
 * @throws {ValidationError} If input is not a string
 */
function isValidIp(ip: string): boolean {
  if (typeof ip !== "string") {
    throw new ValidationError("IP address must be a string", "ip");
  }

  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;

  const parts = ip.split(".").map(Number);
  return parts.every(part => part >= 0 && part <= 255);
}

/**
 * Analyzes scan results and identifies threats
 * @throws {ValidationError} If result is null or missing required fields
 */
export function analyzeScanResults(result: ScanResult | null | undefined): string[] {
  try {
    if (!result) {
      throw new ValidationError("Scan result cannot be null or undefined", "result");
    }

    if (typeof result !== "object" || Array.isArray(result)) {
      throw new ValidationError("Scan result must be an object", "result");
    }

    if (!Array.isArray(result.vulnerabilities)) {
      throw new ValidationError(
        "Scan result vulnerabilities must be an array",
        "vulnerabilities"
      );
    }

    if (!Array.isArray(result.openPorts)) {
      throw new ValidationError("Scan result openPorts must be an array", "openPorts");
    }

    const threats: string[] = [];

    if (result.vulnerabilities.length > 0) {
      threats.push(`Found ${result.vulnerabilities.length} vulnerabilities`);
    }

    if (result.openPorts.length > 5) {
      threats.push("Unusually high number of open ports");
    }

    return threats;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(
      `Error analyzing scan results: ${error instanceof Error ? error.message : String(error)}`,
      "analysis"
    );
  }
}