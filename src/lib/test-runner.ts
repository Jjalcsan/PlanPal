export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export async function runTest(
  name: string,
  fn: () => Promise<void>,
): Promise<TestResult> {
  try {
    await fn();
    return { name, passed: true };
  } catch (e) {
    return { name, passed: false, error: String(e) };
  }
}

export async function runSuite(
  suiteName: string,
  tests: (Promise<TestResult> | (() => Promise<TestResult>))[],
): Promise<{ suite: string; results: TestResult[] }> {
  const resolved = tests.map((t) => (typeof t === "function" ? t() : t));
  const results = await Promise.all(resolved);
  return { suite: suiteName, results };
}

export function printResults(
  suites: { suite: string; results: TestResult[] }[],
): { total: number; passed: number; failed: number } {
  let total = 0;
  let passed = 0;
  let failed = 0;

  for (const { suite, results } of suites) {
    for (const r of results) {
      total++;
      if (r.passed) passed++;
      else failed++;
    }
  }

  return { total, passed, failed };
}
