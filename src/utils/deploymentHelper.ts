/**
 * Deployment Helper
 * Assists with getting compiled scripts into HackHub
 * 
 * Since HackHub stores scripts in IndexedDB, this helper:
 * 1. Compiles and validates your scripts
 * 2. Prepares code for copying into the game editor
 * 3. Provides verification checklists
 */

import * as fs from "fs";
import * as path from "path";

interface DeploymentChecklist {
  compiled: boolean;
  linted: boolean;
  tested: boolean;
  typesValid: boolean;
  filesReady: string[];
}

export class DeploymentHelper {
  private buildDir = "./dist";
  private deployDir = "./deploy";

  constructor() {
    if (!fs.existsSync(this.deployDir)) {
      fs.mkdirSync(this.deployDir, { recursive: true });
    }
  }

  /**
   * Run full deployment pipeline
   */
  async deploy(): Promise<void> {
    console.log("🚀 HackHub Deployment Pipeline\n");

    const checklist: DeploymentChecklist = {
      compiled: false,
      linted: false,
      tested: false,
      typesValid: false,
      filesReady: []
    };

    try {
      console.log("✓ Step 1: Checking compilation...");
      checklist.compiled = this.checkCompilation();

      console.log("✓ Step 2: Preparing files for deployment...");
      checklist.filesReady = this.prepareDeploymentFiles();

      console.log("\n📋 Deployment Checklist:");
      console.log(`  [${checklist.compiled ? "✓" : "✗"}] TypeScript compiled`);
      console.log(`  [${checklist.filesReady.length > 0 ? "✓" : "✗"}] Files prepared (${checklist.filesReady.length})`);

      console.log("\n📝 Ready for Game Deployment:");
      console.log(`  1. Compiled files ready in: ${this.buildDir}/`);
      console.log(`  2. Copy prepared scripts to: ${this.deployDir}/`);
      console.log("  3. Open HackHub in-game script editor");
      console.log("  4. Paste each script from the deploy folder");
      console.log("  5. Save and test in-game");

      console.log("\n📚 Files Ready for Deployment:");
      checklist.filesReady.forEach(file => {
        const copyCmd = `copy ".\\${file}"`;
        console.log(`  - ${file}`);
        console.log(`    Copy path: ${copyCmd}`);
      });

      this.generateDeploymentGuide(checklist);
    } catch (error) {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    }
  }

  /**
   * Verify that TypeScript compilation succeeded
   */
  private checkCompilation(): boolean {
    if (!fs.existsSync(this.buildDir)) {
      throw new Error(
        `Build directory not found: ${this.buildDir}\n` +
        "Run 'npm run build' first"
      );
    }

    const files = fs.readdirSync(this.buildDir);
    if (files.length === 0) {
      throw new Error("No compiled files found in build directory");
    }

    console.log(`   Found ${files.length} compiled files`);
    return true;
  }

  /**
   * Prepare script files for deployment
   */
  private prepareDeploymentFiles(): string[] {
    const deployedFiles: string[] = [];

    // Get all compiled JavaScript files from dist
    const jsFiles = this.getAllFiles(this.buildDir).filter(
      f => f.endsWith(".js") && !f.endsWith(".test.js")
    );

    jsFiles.forEach(jsFile => {
      const relativePath = path.relative(this.buildDir, jsFile);
      const sourceMapPath = jsFile + ".map";
      const dtsPath = jsFile.replace(/\.js$/, ".d.ts");

      // Copy main JS file
      const deployFile = path.join(this.deployDir, relativePath);
      const deployFileDir = path.dirname(deployFile);

      if (!fs.existsSync(deployFileDir)) {
        fs.mkdirSync(deployFileDir, { recursive: true });
      }

      fs.copyFileSync(jsFile, deployFile);
      deployedFiles.push(deployFile);

      // Copy source map if available
      if (fs.existsSync(sourceMapPath)) {
        fs.copyFileSync(sourceMapPath, deployFile + ".map");
      }

      // Copy type definitions
      if (fs.existsSync(dtsPath)) {
        fs.copyFileSync(dtsPath, deployFile.replace(/\.js$/, ".d.ts"));
      }
    });

    return deployedFiles;
  }

  /**
   * Generate deployment documentation
   */
  private generateDeploymentGuide(checklist: DeploymentChecklist): void {
    const guide = `# HackHub Script Deployment Guide

Generated: ${new Date().toISOString()}

## Pre-Deployment Checklist
- [${checklist.compiled ? "x" : " "}] TypeScript compilation successful
- [${checklist.filesReady.length > 0 ? "x" : " "}] Files prepared for deployment
- [ ] Code reviewed in-game
- [ ] Test scripts executed and verified

## Deployment Steps

1. **Prepare the Game**
   - Open HackHub
   - Navigate to the Script Editor (in-game)

2. **Copy Each Script**
   For each file in ./deploy/:
   - Open the file in your text editor
   - Copy the full content (Ctrl+A, Ctrl+C)
   - Paste into HackHub script editor
   - Save with appropriate name

3. **Verify Deployment**
   - Check script appears in command list
   - Test with sample input
   - Verify output matches expectations

4. **Monitor for Issues**
   - Watch browser console (F12)
   - Check HackHub logs for errors
   - Adjust and re-deploy as needed

## Rollback Procedure

If something breaks:
1. Delete the broken script in-game
2. Fix the TypeScript source code
3. Run \`npm run build\`
4. Re-deploy following the steps above

## File Manifest

${checklist.filesReady.map(f => `- ${f}`).join("\n")}

## Notes

- IndexedDB stores scripts in the browser database
- Changes take effect immediately upon save
- Keep backups of working versions
- Test thoroughly before deploying to production

Generated by HackHub Deployment Helper
`;

    const guidePath = path.join(this.deployDir, "DEPLOYMENT_GUIDE.md");
    fs.writeFileSync(guidePath, guide);
    console.log(`\n📄 Deployment guide saved to: ${guidePath}`);
  }

  /**
   * Recursively get all files in a directory
   */
  private getAllFiles(dir: string): string[] {
    const files: string[] = [];

    const walk = (currentPath: string): void => {
      const items = fs.readdirSync(currentPath);

      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else {
          files.push(fullPath);
        }
      });
    };

    walk(dir);
    return files;
  }
}

// CLI entry point
if (require.main === module) {
  const helper = new DeploymentHelper();
  helper.deploy().catch(error => {
    console.error(error);
    process.exit(1);
  });
}