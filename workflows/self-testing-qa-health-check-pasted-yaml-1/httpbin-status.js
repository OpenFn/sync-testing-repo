// httpbin-status: QA health-check node
// Sends a GET request to https://httpbin.org/status/200
// Verifies the returned status code is 200
// Appends a result object to the shared state.qaResults array (never overwrites existing entries)
// Any HTTP failure (non-2xx or network error) is caught and recorded - it never aborts the run

fn(state => {
  const name = 'httpbin-status';
  const endpoint = 'https://httpbin.org/status/200';

  // append exactly one entry to state.qaResults without overwriting existing ones
  const append = (s, result) => ({
    ...s,
    qaResults: [...(s.qaResults || []), result],
  });

  try {
    // parseAs 'text' so we can read the raw body even on failures
    return get(endpoint, { parseAs: 'text' })(state)
      .then(nextState => {
        const status = nextState.response?.statusCode;
        const passed = status === 200;
        return append(nextState, {
          name,
          endpoint,
          passed,
          detail: passed
            ? 'Returned expected status 200'
            : `Expected status 200 but got ${status}`,
        });
      })
      .catch(error => {
        const response = error.response;
        let detail;
        if (response) {
          // non-2xx HTTP response: include status code, status message and body
          detail = `HTTP ${response.status} ${response.statusText || ''}`.trim();
          if (response.data !== undefined && response.data !== null && response.data !== '') {
            const body =
              typeof response.data === 'string'
                ? response.data
                : JSON.stringify(response.data);
            detail += ` - body: ${body}`;
          }
        } else {
          // network / connection failure: no response, use the error message
          detail = `Network error: ${error.message}`;
        }
        return append(state, { name, endpoint, passed: false, detail });
      });
  } catch (error) {
    // safety net: never throw
    return append(state, {
      name,
      endpoint,
      passed: false,
      detail: `Network error: ${error.message}`,
    });
  }
});
