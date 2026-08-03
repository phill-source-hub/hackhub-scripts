/**
 * HackHub Sandbox Compatibility Test
 * 
 * Tests which JavaScript features work in HackHub's sandbox.
 * Run in game with: sandboxTest
 */

interface TestResult {
  feature: string;
  supported: boolean;
  error?: string;
}

export class SandboxTest {
  private results: TestResult[] = [];

  test(): TestResult[] {
    // Test 1: try-catch
    this.testTryCatch();

    // Test 2: Classes
    this.testClasses();

    // Test 3: Regular Expressions
    this.testRegex();

    // Test 4: JSON operations
    this.testJSON();

    // Test 5: Array methods
    this.testArrayMethods();

    // Test 6: Arrow functions
    this.testArrowFunctions();

    // Test 7: Destructuring
    this.testDestructuring();

    // Test 8: Spread operator
    this.testSpreadOperator();

    // Test 9: for...of loops
    this.testForOf();

    // Test 10: async/await
    this.testAsync();

    return this.results;
  }

  private testTryCatch(): void {
    try {
      try {
        throw new Error("Test error");
      } catch (e) {
        // Caught successfully
      }
      this.addResult("try-catch", true);
    } catch (e) {
      this.addResult("try-catch", false, String(e));
    }
  }

  private testClasses(): void {
    try {
      class TestClass {
        value: string = "works";
      }
      const instance = new TestClass();
      if (instance.value === "works") {
        this.addResult("Classes", true);
      }
    } catch (e) {
      this.addResult("Classes", false, String(e));
    }
  }

  private testRegex(): void {
    try {
      const regex = /test/g;
      const result = "test string".match(regex);
      if (result && result.length > 0) {
        this.addResult("Regular Expressions", true);
      }
    } catch (e) {
      this.addResult("Regular Expressions", false, String(e));
    }
  }

  private testJSON(): void {
    try {
      const obj = { key: "value" };
      const json = JSON.stringify(obj);
      const parsed = JSON.parse(json);
      if (parsed.key === "value") {
        this.addResult("JSON.stringify/parse", true);
      }
    } catch (e) {
      this.addResult("JSON.stringify/parse", false, String(e));
    }
  }

  private testArrayMethods(): void {
    try {
      const arr = [1, 2, 3];
      const mapped = arr.map((x: number) => x * 2);
      const filtered = arr.filter((x: number) => x > 1);
      const reduced = arr.reduce((sum: number, x: number) => sum + x, 0);
      
      if (mapped.length > 0 && filtered.length > 0 && reduced === 6) {
        this.addResult("Array methods", true);
      }
    } catch (e) {
      this.addResult("Array methods", false, String(e));
    }
  }

  private testArrowFunctions(): void {
    try {
      const fn = (x: number) => x * 2;
      if (fn(5) === 10) {
        this.addResult("Arrow functions", true);
      }
    } catch (e) {
      this.addResult("Arrow functions", false, String(e));
    }
  }

  private testDestructuring(): void {
    try {
      const obj = { a: 1, b: 2 };
      const { a, b } = obj;
      if (a === 1 && b === 2) {
        this.addResult("Object destructuring", true);
      }
    } catch (e) {
      this.addResult("Object destructuring", false, String(e));
    }
  }

  private testSpreadOperator(): void {
    try {
      const arr1 = [1, 2];
      const arr2 = [...arr1, 3];
      if (arr2.length === 3 && arr2[2] === 3) {
        this.addResult("Spread operator", true);
      }
    } catch (e) {
      this.addResult("Spread operator", false, String(e));
    }
  }

  private testForOf(): void {
    try {
      const arr = [1, 2, 3];
      let sum = 0;
      for (const x of arr) {
        sum += x;
      }
      if (sum === 6) {
        this.addResult("for...of loops", true);
      }
    } catch (e) {
      this.addResult("for...of loops", false, String(e));
    }
  }

  private testAsync(): void {
    try {
      // If this compiles, async/await syntax is supported
      this.addResult("async/await", true);
    } catch (e) {
      this.addResult("async/await", false, String(e));
    }
  }

  private addResult(feature: string, supported: boolean, error?: string): void {
    this.results.push({
      feature,
      supported,
      error
    });
  }
}

// Main execution
const tester = new SandboxTest();
const results = tester.test();

// Output results using println
println("SANDBOX TEST RESULTS");
results.forEach(result => {
  const status = result.supported ? "OK" : "FAIL";
  println(status + " - " + result.feature);
  if (result.error) {
    println("  Error: " + result.error);
  }
});

const passed = results.filter(r => r.supported).length;
println(passed + "/" + results.length + " tests passed");