// Node: httpbin-post
// Sends a POST to https://httpbin.org/post with a small JSON body.
// Verifies the response's `json` field echoes back the body we sent.
// Appends a QA result to the shared state.qaResults array (never overwrites).
// Records passed:false on failure instead of throwing.

const endpoint = 'https://httpbin.org/post';

fn(state => {
  // ensure the shared array exists without overwriting existing entries
  const qaResults = state.qaResults || [];

  const body = { qa: 'openfn', ts: Date.now() };

  // Invoke the request inside fn so we can catch any failure.
  // A non-2xx response or a network error rejects here instead of
  // aborting the whole workflow.
  return post(endpoint, body)(state)
    .then(nextState => {
      // ---- success: keep the existing check logic ----
      const echoed = nextState.data && nextState.data.json;

      const passed =
        !!echoed && echoed.qa === 'openfn' && typeof echoed.ts !== 'undefined';

      const result = {
        name: 'httpbin-post',
        endpoint,
        passed,
        detail: passed
          ? 'Response json echoed the posted body.'
          : `Echo mismatch: ${JSON.stringify(echoed)}`,
      };

      return { ...nextState, qaResults: [...qaResults, result] };
    })
    .catch(error => {
      // ---- failure: never throw, record passed:false ----
      const response = error && error.response;

      let detail;
      if (response) {
        const bodyText =
          typeof response.data === 'undefined'
            ? ''
            : ` Body: ${JSON.stringify(response.data)}`;
        detail = `HTTP ${response.status} ${response.statusText || ''}.${bodyText}`.trim();
      } else {
        detail = `Network error: ${(error && error.message) || String(error)}`;
      }

      const result = {
        name: 'httpbin-post',
        endpoint,
        passed: false,
        detail,
      };

      return { ...state, qaResults: [...qaResults, result] };
    });
});
