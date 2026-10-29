// QA health-check node: universities-search
// Sends a GET request to the Hipolabs universities API for Kenya.
// Verifies the response is a non-empty array where each university has a name and country.
// Appends a pass/fail result object to the shared state.qaResults array.
// Does not throw on failure - records passed:false instead.

fn(state => {
  const name = 'universities-search';
  const endpoint = 'http://universities.hipolabs.com/search?country=Kenya';
  const qaResults = state.qaResults || [];

  return get(endpoint)(state)
    .then(nextState => {
      // Success: run the existing check logic on the response.
      const data = nextState.data;
      const isArray = Array.isArray(data);
      const nonEmpty = isArray && data.length > 0;
      const allValid =
        nonEmpty && data.every(u => u && u.name && u.country);
      const passed = Boolean(nonEmpty && allValid);

      qaResults.push({
        name,
        endpoint,
        passed,
        detail: String(isArray ? data.length : 0),
      });

      return { ...nextState, qaResults };
    })
    .catch(error => {
      // Failure: never throw - record passed:false with a full explanation.
      const response = error && error.response;
      let detail;

      if (response) {
        // HTTP error (non-2xx response).
        const status = response.status;
        const statusText = response.statusText || '';
        let body = response.data;
        if (body && typeof body === 'object') {
          body = JSON.stringify(body);
        }
        detail =
          `HTTP ${status} ${statusText}`.trim() +
          (body ? ` - ${body}` : '');
      } else {
        // Network error (no response received).
        detail = `Network error: ${error && error.message ? error.message : String(error)}`;
      }

      qaResults.push({
        name,
        endpoint,
        passed: false,
        detail,
      });

      return { ...state, qaResults };
    });
});
