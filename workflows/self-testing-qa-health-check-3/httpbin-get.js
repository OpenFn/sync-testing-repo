// QA health-check node: httpbin-get
// - Sends a GET request to https://httpbin.org/get?qa=openfn
// - Verifies the response echoes back the request (args + url present)
// - Appends a result object to the shared state.qaResults array
// - Never throws on failure: records passed:false so later checks still run

get('https://httpbin.org/get?qa=openfn');

fn(state => {
  const name = 'httpbin-get';
  const endpoint = 'https://httpbin.org/get?qa=openfn';

  // Ensure the shared results array exists without overwriting entries
  const qaResults = state.qaResults || [];

  let passed = false;
  let detail = '';

  try {
    const body = state.data || {};
    const echoedQa = body.args && body.args.qa === 'openfn';
    const echoedUrl = typeof body.url === 'string' && body.url.includes('httpbin.org/get');
    passed = Boolean(echoedQa && echoedUrl);
    detail = passed
      ? 'Response echoed args.qa=openfn and url as expected.'
      : `Echo check failed. args=${JSON.stringify(body.args)}, url=${body.url}`;
  } catch (e) {
    passed = false;
    detail = `Assertion error: ${e.message}`;
  }

  return {
    ...state,
    qaResults: [...qaResults, { name, endpoint, passed, detail }],
  };
});
