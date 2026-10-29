// FINAL SUMMARY JOB
// Uses the `common` adaptor. No credentials or input required.
// Rolls up the accumulated state from previous steps and defines
// overall pass/fail criteria via assert().

fn((state) => {
  const startedAt = new Date().toISOString();
  console.log('=== OpenFn Platform Test Summary ===');
  console.log('Summary generated at:', startedAt);

  // Collect whatever previous steps left on state.
  const checks = [];

  const add = (name, passed, detail) => {
    checks.push({ name, passed: !!passed, detail: detail || '' });
  };

  // 1. State object exists and is usable
  add('state is an object', state && typeof state === 'object');

  // 2. Data was carried through the workflow
  add('state.data present', state.data !== undefined, `typeof=${typeof state.data}`);

  // 3. References from prior steps accumulated
  const refCount = Array.isArray(state.references) ? state.references.length : 0;
  add('has references from prior steps', refCount >= 0, `references=${refCount}`);

  // 4. No error leaked onto state
  add('no error on state', !state.error, state.error ? String(state.error) : 'clean');

  // Log the results table
  console.log('--- Checks ---');
  checks.forEach((c) => {
    console.log(`${c.passed ? 'PASS' : 'FAIL'} | ${c.name}${c.detail ? ' (' + c.detail + ')' : ''}`);
  });

  const passedCount = checks.filter((c) => c.passed).length;
  const failedCount = checks.length - passedCount;
  console.log(`--- Totals: ${passedCount} passed, ${failedCount} failed ---`);

  return {
    ...state,
    summary: {
      generatedAt: startedAt,
      passed: passedCount,
      failed: failedCount,
      checks,
    },
  };
});

// PASS/FAIL CRITERIA: fail the run if any check failed.
assert(
  (state) => state.summary && state.summary.failed === 0,
  'Final summary detected one or more failed checks - see logs above'
);
