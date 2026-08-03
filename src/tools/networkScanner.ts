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

/**
 * Scans a target IP for open ports and services
 * @param targetIp - Target IP address to scan
 * @param options - Optional scan configuration
 * @returns Promise resolving to scan results
 */
export async function scanTarget(
  targetIp: string,
  options: ScanOptions = {}
): Promise<ScanResult> {
  const { deepScan = false } = options;

  if (!isValidIp(targetIp)) {
    throw new Error(`Invalid IP address: ${targetIp}`);
  }

  // Simulated scan logic (replace with actual HackHub API calls)
  const result: ScanResult = {
    ip: targetIp,
    openPorts: [22, 80, 443],
    services: ["ssh", "http", "https"],
    vulnerabilities: deepScan ? ["CVE-2024-1234"] : []
  };

  return result;
}

/**
 * Validates IPv4 address format
 */
function isValidIp(ip: string): boolean {
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipRegex.test(ip)) return false;

  const parts = ip.split(".").map(Number);
  return parts.every(part => part >= 0 && part <= 255);
}

/**
 * Analyzes scan results and identifies threats
 */
export function analyzeScanResults(result: ScanResult): string[] {
  const threats: string[] = [];

  if (result.vulnerabilities.length > 0) {
    threats.push(`Found ${result.vulnerabilities.length} vulnerabilities`);
  }

  if (result.openPorts.length > 5) {
    threats.push("Unusually high number of open ports");
  }

  return threats;
}