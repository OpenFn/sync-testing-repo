// numbers-trivia QA health-check node
// - Sends a GET request to http://numbersapi.com/random/trivia
// - Verifies the response body is a non-empty text string of trivia
// - Appends a result object to the shared state.qaResults array
// - Never overwrites existing results; never throws on failure

get('http://numbersapi.com/random/trivia', { parseAs: 'text' });

fn(state => {
  const endpoint = 'http://numbersapi.com/random/trivia';
  const trivia = typeof state.data === 'string' ? state.data.trim() : '';
  const passed = trivia.length > 0;

  const qaResults = state.qaResults || [];

  return {
    ...state,
    qaResults: [
      ...qaResults,
      {
        name: 'numbers-trivia',
        endpoint,
        passed,
        detail: trivia,
      },
    ],
  };
});