// github-repo: QA health-check node
// GETs https://api.github.com/repos/OpenFn/kit with a required User-Agent header.
// Verifies the response full_name equals 'OpenFn/kit'.
// Appends a pass/fail result to the shared state.qaResults array without throwing.

get('https://api.github.com/repos/OpenFn/kit', {
  headers: { 'User-Agent': 'openfn-qa' },
});

fn(state => {
  const endpoint = 'https://api.github.com/repos/OpenFn/kit';
  const qaResults = state.qaResults || [];

  const body = state.data || {};
  const passed = body.full_name === 'OpenFn/kit';

  qaResults.push({
    name: 'github-repo',
    endpoint,
    passed,
    detail: passed
      ? `stargazers_count: ${body.stargazers_count}`
      : `Expected full_name 'OpenFn/kit', got '${body.full_name}'`,
  });

  return { ...state, qaResults };
});
