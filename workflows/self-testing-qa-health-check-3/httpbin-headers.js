// httpbin-headers QA health check
// Sends a GET request to https://httpbin.org/headers
// Verifies the response contains a headers object that includes a Host header
// Appends a result to the shared state.qaResults array (never overwrites existing entries)
// Does not throw on failure - records passed:false with detail instead

get('https://httpbin.org/headers');

fn(state => {
  const endpoint = 'https://httpbin.org/headers';
  const qaResults = state.qaResults || [];

  let passed = false;
  let detail = '';

  try {
    const headers = state.data && state.data.headers;
    if (headers && typeof headers === 'object' && headers.Host) {
      passed = true;
      detail = `Host header present: ${headers.Host}`;
    } else if (headers && typeof headers === 'object') {
      detail = 'headers object found but no Host header';
    } else {
      detail = 'no headers object in response';
    }
  } catch (e) {
    detail = `assertion error: ${e.message}`;
  }

  const result = {
    name: 'httpbin-headers',
    endpoint,
    passed,
    detail,
  };

  return { ...state, qaResults: [...qaResults, result] };
});