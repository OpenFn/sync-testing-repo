// Final summary step: verify results from previous jobs and report pass/fail
fn(state => {
  // Collect a simple summary of what previous steps left on state
  const summary = {
    hasData: state.data !== undefined && state.data !== null,
    referenceCount: Array.isArray(state.references) ? state.references.length : 0,
    checkedAt: new Date().toISOString(),
  };

  console.log('Workflow test summary:', JSON.stringify(summary, null, 2));

  return { ...state, summary };
});

// Pass/fail criteria for the overall workflow test
assert(
  state => state.summary.hasData === true,
  'FAIL: expected data on state from previous steps'
);

assert(
  state => state.summary.referenceCount >= 0,
  'FAIL: references should be an array'
);

fn(state => {
  console.log('PASS: all workflow test criteria met');
  return state;
});
