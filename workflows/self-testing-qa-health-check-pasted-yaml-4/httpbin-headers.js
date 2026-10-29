// httpbin-headers QA health check
// Sends a GET request to https://httpbin.org/headers
// Verifies the response contains a headers object that includes a Host header
// Appends a result to the shared state.qaResults array (never overwrites existing entries)
// Does not throw on failure - records passed:false with detail instead

fn(state => {
  const endpoint = 'https://httpbin.org/headers';
  const name = 'httpbin-headers';

  const append = result => ({
    ...state,
    qaResults: [...(state.qaResults || []), { name, endpoint, ...result }],
  });

  return get(endpoint)(state)
    .then(nextState => {
      let passed = false;
      let detail = '';

      const headers = nextState.data && nextState.data.headers;
      if (headers && typeof headers === 'object' && headers.Host) {
        passed = true;
        detail = `Host header present: ${headers.Host}`;
      } else if (headers && typeof headers === 'object') {
        detail = 'headers object found but no Host header';
      } else {
        detail = 'no headers object in response';
      }

      return {
        ...nextState,
        qaResults: [
          ...(nextState.qaResults || []),
          { name, endpoint, passed, detail },
        ],
      };
    })
    .catch(error => {
      let detail;
      const response = error && error.response;

      if (response && response.status) {
        const status = response.status;
        const statusText = response.statusText || '';
        let body = response.data;
        if (body && typeof body === 'object') {
          body = JSON.stringify(body);
        }
        detail = `HTTP ${status} ${statusText}`.trim();
        if (body) detail += ` - body: ${body}`;
      } else {
        detail = `network error: ${error && error.message ? error.message : String(error)}`;
      }

      return append({ passed: false, detail });
    });
});