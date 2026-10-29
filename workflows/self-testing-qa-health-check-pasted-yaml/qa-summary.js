// qa-summary: Final QA reporting node.
// - Does NOT make any HTTP request.
// - Reads accumulated results from state.qaResults (each: name, endpoint, passed, detail).
// - Builds a summary (total, passed, failed, failed names, timestamp) at state.qaSummary.
// - Logs a readable line per check plus the totals.

fn(state => {
  const results = state.qaResults || [];

  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);

  const summary = {
    total: results.length,
    passed: passed.length,
    failed: failed.length,
    failedChecks: failed.map(r => r.name),
    timestamp: new Date().toISOString(),
  };

  // Log a readable line per check
  results.forEach(r => {
    console.log(`${r.passed ? 'PASS' : 'FAIL'} - ${r.name} (${r.endpoint})${r.detail ? ' :: ' + r.detail : ''}`);
  });

  // Log the totals
  console.log(`QA Summary: ${summary.passed}/${summary.total} passed, ${summary.failed} failed`);
  if (summary.failed > 0) {
    console.log(`Failed checks: ${summary.failedChecks.join(', ')}`);
  }

  return { ...state, qaSummary: summary };
});
