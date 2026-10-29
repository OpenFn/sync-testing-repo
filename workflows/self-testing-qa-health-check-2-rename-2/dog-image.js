// Node: dog-image
// QA health-check for the Dog CEO random image API.
// Sends GET https://dog.ceo/api/breeds/image/random
// Verifies the response status is 'success' and message is a URL string.
// Appends a result to state.qaResults without overwriting existing entries.
// Never aborts the run: any HTTP/network failure is caught and recorded.

fn(state => {
  const endpoint = 'https://dog.ceo/api/breeds/image/random';
  const qaResults = state.qaResults || [];

  return get(endpoint)(state)
    .then(nextState => {
      const body = nextState.data || {};
      const url = body.message;
      const isUrl = typeof url === 'string' && /^https?:\/\//.test(url);
      const passed = body.status === 'success' && isUrl;

      qaResults.push({
        name: 'dog-image',
        endpoint,
        passed,
        detail: isUrl ? url : null,
      });

      return { ...nextState, qaResults };
    })
    .catch(error => {
      const response = error.response;
      let detail;

      if (response) {
        const status = response.status;
        const statusText = response.statusText || '';
        const bodyText =
          response.data !== undefined
            ? typeof response.data === 'string'
              ? response.data
              : JSON.stringify(response.data)
            : '';
        detail = `HTTP ${status} ${statusText}`.trim();
        if (bodyText) detail += ` - ${bodyText}`;
      } else {
        detail = `Network error: ${error.message}`;
      }

      qaResults.push({
        name: 'dog-image',
        endpoint,
        passed: false,
        detail,
      });

      return { ...state, qaResults };
    });
});
