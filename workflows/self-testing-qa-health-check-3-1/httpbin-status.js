// httpbin-status: QA health-check node
// Sends a GET request to https://httpbin.org/status/200
// Verifies the returned status code is 200
// Appends a result object to the shared state.qaResults array (never overwrites existing entries)

get('https://httpbin.org/status/200', {
  // don't throw on non-2xx responses so we can record the failure instead
  parseAs: 'text',
});

fn(state => {
  const endpoint = 'https://httpbin.org/status/200';
  const status = state.response?.status;
  const passed = status === 200;

  const result = {
    name: 'httpbin-status',
    endpoint,
    passed,
    detail: passed
      ? 'Returned expected status 200'
      : `Expected status 200 but got ${status}`,
  };

  const qaResults = state.qaResults || [];

  return { ...state, qaResults: [...qaResults, result] };
});
