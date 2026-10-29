// github-repo: QA health-check node
// GETs https://api.github.com/repos/OpenFn/kit with a required User-Agent header.
// Verifies the response full_name equals 'OpenFn/kit'.
// Appends a pass/fail result to the shared state.qaResults array without throwing.

fn(state => {
  const endpoint = 'https://api.github.com/repos/OpenFn/kit';
  const qaResults = state.qaResults || [];

  return get(endpoint, { headers: { 'User-Agent': 'openfn-qa' } })(state)
    .then(nextState => {
      const body = nextState.data || {};
      const passed = body.full_name === 'OpenFn/kit';

      qaResults.push({
        name: 'github-repo',
        endpoint,
        passed,
        detail: passed
          ? `stargazers_count: ${body.stargazers_count}`
          : `Expected full_name 'OpenFn/kit', got '${body.full_name}'`,
      });

      return { ...nextState, qaResults };
    })
    .catch(error => {
      // A non-2xx response carries an HTTP response; a network error does not.
      const response = error.response || (error.body && error) || null;
      let detail;

      if (response && (response.status || response.statusCode)) {
        const status = response.status || response.statusCode;
        const message = response.statusText || response.statusMessage || '';
        const body = response.body ?? response.data;
        const bodyText =
          body == null
            ? 'no body'
            : typeof body === 'string'
            ? body
            : JSON.stringify(body);
        detail = `HTTP ${status} ${message} - ${bodyText}`.trim();
      } else {
        detail = `Network error: ${error.message || String(error)}`;
      }

      qaResults.push({
        name: 'github-repo',
        endpoint,
        passed: false,
        detail,
      });

      return { ...state, qaResults };
    });
});
