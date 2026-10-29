// Node: httpbin-post
// Sends a POST to https://httpbin.org/post with a small JSON body.
// Verifies the response's `json` field echoes back the body we sent.
// Appends a QA result to the shared state.qaResults array (never overwrites).
// Records passed:false on failure instead of throwing.

const endpoint = 'https://httpbin.org/post';
const body = { qa: 'openfn', ts: Date.now() };

post(endpoint, { body })(state => state); // keep body available below

post(endpoint, state => ({
  body: { qa: 'openfn', ts: Date.now() },
}));

fn(state => {
  // ensure the shared array exists without overwriting existing entries
  const qaResults = state.qaResults || [];

  const sent = { qa: 'openfn' };
  const echoed = state.data && state.data.json;

  const passed = !!echoed && echoed.qa === 'openfn' && typeof echoed.ts !== 'undefined';

  const result = {
    name: 'httpbin-post',
    endpoint: 'https://httpbin.org/post',
    passed,
    detail: passed
      ? 'Response json echoed the posted body.'
      : `Echo mismatch: ${JSON.stringify(echoed)}`,
  };

  return { ...state, qaResults: [...qaResults, result] };
});
