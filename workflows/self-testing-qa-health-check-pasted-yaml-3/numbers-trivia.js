// numbers-trivia QA health-check node
// - Sends a GET request to http://numbersapi.com/random/trivia
// - Verifies the response body is a non-empty text string of trivia
// - Appends a result object to the shared state.qaResults array
// - Never overwrites existing results; never throws on failure

fn(state => {
  const name = 'numbers-trivia';
  const endpoint =
    'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';

  return get(endpoint)(state)
    .then(nextState => {
      // Success: response is JSON with a `text` field
      const body = nextState.data;
      const trivia =
        body && typeof body.text === 'string' ? body.text.trim() : '';
      const passed = trivia.length > 0;

      const qaResults = nextState.qaResults || [];

      return {
        ...nextState,
        qaResults: [
          ...qaResults,
          { name, endpoint, passed, detail: trivia },
        ],
      };
    })
    .catch(error => {
      // Failure: never throw, append a passed:false entry
      let detail;
      if (error && error.statusCode) {
        detail = `HTTP ${error.statusCode} ${error.statusMessage || ''}`.trim();
        if (error.body) {
          detail += `: ${
            typeof error.body === 'string'
              ? error.body
              : JSON.stringify(error.body)
          }`;
        }
      } else {
        detail = (error && error.message) || String(error);
      }

      const qaResults = state.qaResults || [];

      return {
        ...state,
        qaResults: [
          ...qaResults,
          { name, endpoint, passed: false, detail },
        ],
      };
    });
});