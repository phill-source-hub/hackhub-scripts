/* eslint-disable no-console */

/**
 * Claude Helper
 * Integrates with Claude API for development assistance
 * 
 * Usage: Get code reviews, generate test cases, or brainstorm implementations
 * Set ANTHROPIC_API_KEY environment variable before using
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

interface CodeReviewRequest {
  filePath: string;
  context?: string;
}

interface TestGenerationRequest {
  functionName: string;
  functionCode: string;
  existingTests?: string;
}

export class ClaudeHelper {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is not set. " +
        "Get an API key from https://console.anthropic.com/"
      );
    }
    this.client = new Anthropic({ apiKey });
  }

  /**
   * Request a code review from Claude for a TypeScript file
   */
  async reviewCode(request: CodeReviewRequest): Promise<string> {
    const fileContent = fs.readFileSync(request.filePath, "utf-8");

    const prompt = `You are an expert TypeScript developer specializing in HackHub scripting.

File: ${request.filePath}
Context: ${request.context || "General code review"}

Please review this TypeScript code for:
1. Type safety and correctness
2. Performance considerations
3. Error handling
4. Adherence to HackHub API conventions
5. Testing coverage recommendations

Code:
\`\`\`typescript
${fileContent}
\`\`\`

Provide constructive feedback and specific improvement suggestions.`;

    const message = await this.client.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    if (message.content[0].type === "text") {
      return message.content[0].text;
    }

    throw new Error("Unexpected response format from Claude");
  }

  /**
   * Generate test cases for a function using Claude
   */
  async generateTests(request: TestGenerationRequest): Promise<string> {
    const prompt = `You are a Jest testing expert specializing in TypeScript.

Function: ${request.functionName}

Code:
\`\`\`typescript
${request.functionCode}
\`\`\`

${request.existingTests ? `Existing tests:\n\`\`\`typescript\n${request.existingTests}\n\`\`\`` : ""}

Generate comprehensive Jest test cases for this function. Include:
1. Happy path tests
2. Edge cases and boundary conditions
3. Error conditions
4. Type safety tests

Return only valid Jest test code that can be run immediately.`;

    const message = await this.client.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    if (message.content[0].type === "text") {
      return message.content[0].text;
    }

    throw new Error("Unexpected response format from Claude");
  }

  /**
   * Brainstorm implementation approach for a HackHub feature
   */
  async brainstormFeature(featureDescription: string): Promise<string> {
    const prompt = `You are an expert HackHub script developer.

Feature Request: ${featureDescription}

Based on the HackHub scripting API and best practices:
1. Outline the implementation approach
2. Identify key API methods needed
3. Suggest modular design patterns
4. Highlight potential challenges
5. Recommend testing strategy

Provide actionable technical guidance.`;

    const message = await this.client.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    if (message.content[0].type === "text") {
      return message.content[0].text;
    }

    throw new Error("Unexpected response format from Claude");
  }
}

// CLI helper for easy access
if (require.main === module) {
  const command = process.argv[2];
  const helper = new ClaudeHelper();

  (async () => {
    try {
      if (command === "review" && process.argv[3]) {
        const review = await helper.reviewCode({ filePath: process.argv[3] });
        console.log(review);
      } else if (command === "brainstorm" && process.argv[3]) {
        const ideas = await helper.brainstormFeature(process.argv[3]);
        console.log(ideas);
      } else {
        console.log(`
Usage:
  npx ts-node src/utils/claudeHelper.ts review <file>
  npx ts-node src/utils/claudeHelper.ts brainstorm "<feature description>"
        `);
      }
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  })();
}