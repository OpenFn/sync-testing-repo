// iss-location: QA health-check node
// Sends a GET request to the Open Notify ISS location API
// Verifies the response message is 'success' and includes an iss_position with latitude/longitude
// Appends a pass/fail result to the shared state.qaResults array (never overwrites existing entries)
// The request is wrapped so any failure (non-2xx or network error) is caught and recorded, never thrown

fn(state => {
  const endpoint = 'https://api.wheretheiss.at/v1/satellites/25544';
  const qaResults = state.qaResults || [];

  const appendResult = result => ({
    ...state,
    qaResults: [...qaResults, result],
  });

  return get(endpoint)(state)
    .then(next => {
      const body = next.data || {};

      const passed = body.latitude != null && body.longitude != null;

      return appendResult({
        name: 'iss-location',
        endpoint,
        passed,
        detail: `latitude=${body.latitude}, longitude=${body.longitude}`,
      });
    })
    .catch(error => {
      const response = error.response;
      let detail;

      if (response) {
        // Non-2xx HTTP response: include status code, status message and body
        const body =
          typeof response.body === 'string'
            ? response.body
            : JSON.stringify(response.body);
        detail = `HTTP ${response.statusCode} ${
          response.statusMessage || ''
        }`.trim();
        if (body) detail += ` - ${body}`;
      } else {
        // Network / other failure: use the error message
        detail = `Network error: ${error.message}`;
      }

      return appendResult({
        name: 'iss-location',
        endpoint,
        passed: false,
        detail,
      });
    });
});