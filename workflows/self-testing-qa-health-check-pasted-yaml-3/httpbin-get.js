// QA health-check node: httpbin-get
// - Sends a GET request to https://httpbin.org/get?qa=openfn
// - Verifies the response echoes back the request (args + url present)
// - Appends a result object to the shared state.qaResults array
// - Never throws on failure: records passed:false so later checks still run
// - where is this?
// - and this?

// This line is purely for testing
// Feel free to delete once testing is complete
fn(state => {
  const name = 'httpbin-get';
  const endpoint = 'https://httpbin.org/get?qa=openfn';

  // Ensure the shared results array exists without overwriting entries
  const qaResults = state.qaResults || [];

  // Run the request inside the callback so any failure (non-2xx or network
  // error) is caught here and never aborts the workflow.
  return get(endpoint)(state)
    .then(nextState => {
      let passed = false;
      let detail = '';

      const body = nextState.data || {};
      const echoedQa = body.args && body.args.qa === 'openfn';
      const echoedUrl =
        typeof body.url === 'string' && body.url.includes('httpbin.org/get');
      passed = Boolean(echoedQa && echoedUrl);
      detail = passed
        ? 'Response echoed args.qa=openfn and url as expected.'
        : `Echo check failed. args=${JSON.stringify(body.args)}, url=${body.url}`;

      return {
        ...nextState,
        qaResults: [...qaResults, { name, endpoint, passed, detail }],
      };
    })
    .catch(error => {
      const res = error.response;
      let detail;
      if (res) {
        // HTTP error: include status code, status message and body if present
        const bodyText =
          res.body !== undefined
            ? JSON.stringify(res.body)
            : res.data !== undefined
            ? JSON.stringify(res.data)
            : '(no body)';
        detail = `HTTP ${res.status} ${res.statusText || ''}. Body: ${bodyText}`;
      } else {
        // Network failure or other error with no HTTP response
        detail = `Network error: ${error.message}`;
      }

      return {
        ...state,
        qaResults: [...qaResults, { name, endpoint, passed: false, detail }],
      };
    });
});