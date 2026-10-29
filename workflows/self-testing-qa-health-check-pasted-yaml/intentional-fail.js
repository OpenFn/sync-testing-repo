// QA health-check node: intentional-fail
// A deliberately-failing check that proves the failure-reporting path works.
// It performs no real request - it simply records a synthetic failure.
// Does not throw and completes successfully so the chain continues on on_job_success.

fn(state => {
  const name = 'intentional-fail';
  const endpoint = 'n/a - deliberate failure';
  const qaResults = state.qaResults || [];

  qaResults.push({
    name,
    endpoint,
    passed: false,
    detail:
      'Intentional/synthetic failure. This check always reports passed:false ' +
      'to verify that the QA failure-reporting and notification path works end to end. ' +
      'No external system was called and no error was thrown.',
  });

  return { ...state, qaResults };
});
