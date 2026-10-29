// QA health-check: cat-fact
// GET https://catfact.ninja/fact
// Verifies the response contains a non-empty 'fact' string.
// Appends a result object to state.qaResults (never overwrites existing entries).
// Records passed:false on failure instead of throwing.

fn(state => {
  const name = 'cat-fact';
  const endpoint = 'https://catfact.ninja/fact';

  return get(endpoint)(state)
    .then(nextState => {
      const fact = nextState.data && nextState.data.fact;
      const passed = typeof fact === 'string' && fact.trim().length > 0;

      const result = {
        name,
        endpoint,
        passed,
        detail: passed ? fact.slice(0, 200) : 'No valid fact returned',
      };

      const qaResults = nextState.qaResults || [];
      return { ...nextState, qaResults: [...qaResults, result] };
    })
    .catch(error => {
      let detail;
      if (error.response) {
        const { status, statusText, data } = error.response;
        const body =
          data == null
            ? ''
            : ` - body: ${
                typeof data === 'string' ? data : JSON.stringify(data)
              }`;
        detail = `HTTP ${status} ${statusText || ''}`.trim() + body;
      } else {
        detail = `Network error: ${error.message}`;
      }

      const result = { name, endpoint, passed: false, detail };
      const qaResults = state.qaResults || [];
      return { ...state, qaResults: [...qaResults, result] };
    });
});