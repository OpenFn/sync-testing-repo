// Node: advice-slip
// Sends a GET request to https://api.adviceslip.com/advice
// Verifies the response has a `slip` object with a non-empty `advice` string.
// The API sometimes returns a JSON string, so parsing is handled gracefully.
// Appends a QA result { name, endpoint, passed, detail } to state.qaResults
// without overwriting existing entries and without throwing on failure.

get('https://api.adviceslip.com/advice');

fn(state => {
  const endpoint = 'https://api.adviceslip.com/advice';
  const qaResults = state.qaResults || [];

  let passed = false;
  let detail = null;

  try {
    let body = state.data;

    // Handle case where the API returns text that needs JSON parsing
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const advice = body && body.slip && body.slip.advice;

    if (typeof advice === 'string' && advice.trim().length > 0) {
      passed = true;
      detail = advice;
    } else {
      detail = 'Missing or empty slip.advice';
    }
  } catch (e) {
    passed = false;
    detail = `Failed to parse response: ${e.message}`;
  }

  return {
    ...state,
    qaResults: [...qaResults, { name: 'advice-slip', endpoint, passed, detail }],
  };
});
