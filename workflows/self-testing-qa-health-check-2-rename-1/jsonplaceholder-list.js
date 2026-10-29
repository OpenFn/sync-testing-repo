// jsonplaceholder-list
// QA health-check node: GETs https://jsonplaceholder.typicode.com/posts
// Verifies the response is a non-empty array whose first item has an id and title.
// Appends a { name, endpoint, passed, detail } record to the shared state.qaResults array.
// Never throws on failure and never overwrites existing qaResults entries.

fn(state => {
  const name = 'jsonplaceholder-list';
  const endpoint = 'https://jsonplaceholder.typicode.com/posts';
  const qaResults = Array.isArray(state.qaResults) ? state.qaResults : [];

  return get(endpoint)(state)
    .then(nextState => {
      const posts = nextState.data;
      const isArray = Array.isArray(posts);
      const count = isArray ? posts.length : 0;
      const first = isArray ? posts[0] : undefined;

      const passed = Boolean(
        isArray &&
        count > 0 &&
        first &&
        first.id !== undefined &&
        first.title !== undefined
      );

      const detail = passed
        ? `Received ${count} posts`
        : `Verification failed (isArray: ${isArray}, count: ${count})`;

      return {
        ...nextState,
        qaResults: [...qaResults, { name, endpoint, passed, detail }],
      };
    })
    .catch(error => {
      const response = error.response;
      let detail;

      if (response) {
        const status = response.statusCode ?? response.status ?? '';
        const message = response.statusMessage ?? '';
        const body = response.body ?? response.data;
        const bodyText =
          body === undefined || body === null || body === ''
            ? ''
            : ` - ${typeof body === 'string' ? body : JSON.stringify(body)}`;
        detail = `HTTP ${status} ${message}${bodyText}`.trim();
      } else {
        detail = `Network error: ${error.message}`;
      }

      return {
        ...state,
        qaResults: [...qaResults, { name, endpoint, passed: false, detail }],
      };
    });
});
