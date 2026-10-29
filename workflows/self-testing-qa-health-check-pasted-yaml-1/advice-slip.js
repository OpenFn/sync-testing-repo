// Node: advice-slip
// Sends a GET request to https://api.adviceslip.com/advice
// Verifies the response has a `slip` object with a non-empty `advice` string.
// The API sometimes returns a JSON string, so parsing is handled gracefully.
// Appends a QA result { name, endpoint, passed, detail } to state.qaResults
// without overwriting existing entries and without throwing on failure.
// The request is wrapped so a non-2xx response or a network error never aborts the run.

fn(state => {
  const name = 'advice-slip';
  const endpoint = 'https://api.adviceslip.com/advice';
  const qaResults = state.qaResults || [];

  const append = (entry, base) => ({
    ...(base || state),
    qaResults: [...qaResults, entry],
  });

  const failFromResponse = res => {
    const status = res.statusCode;
    const statusText = res.statusText || '';
    let body = '';
    if (res.data !== undefined && res.data !== null && res.data !== '') {
      body =
        typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    }
    const detail = `HTTP ${status} ${statusText}`.trim() +
      (body ? ` - ${body}` : '');
    return { name, endpoint, passed: false, detail };
  };

  // validateStatus prevents non-2xx from throwing; .catch handles network errors.
  return get(endpoint, { validateStatus: () => true })(state)
    .then(s => {
      const res = s.response || {};
      const status = res.statusCode;

      // Non-2xx response: record failure with full explanation.
      if (typeof status !== 'number' || status < 200 || status >= 300) {
        return append(failFromResponse({ ...res, data: s.data }), s);
      }

      // Success: keep the existing check logic.
      let passed = false;
      let detail = null;

      try {
        let body = s.data;

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

      return append({ name, endpoint, passed, detail }, s);
    })
    .catch(e => {
      // A response present here means an HTTP error; otherwise a network failure.
      if (e && e.response) {
        return append(failFromResponse(e.response));
      }
      return append({
        name,
        endpoint,
        passed: false,
        detail: `Request failed: ${e.message}`,
      });
    });
});
