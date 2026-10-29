// jsonplaceholder-create
// QA health-check node: POSTs a sample post to the JSONPlaceholder mock API.
// Verifies the response returns a created resource with an id (mock returns 101).
// Appends a pass/fail result to the shared state.qaResults array (never overwrites).
// The request is wrapped so any failure is caught and never aborts the run.

fn(state => {
  const name = 'jsonplaceholder-create';
  const endpoint = 'https://jsonplaceholder.typicode.com/posts';
  const qaResults = state.qaResults || [];

  return post(endpoint, {
    title: 'qa',
    body: 'openfn health check',
    userId: 1,
  })(state)
    .then(nextState => {
      const id = nextState.data && nextState.data.id;
      const passed = id != null;

      const result = {
        name,
        endpoint,
        passed,
        detail: passed
          ? `Created resource with id ${id}`
          : 'No id returned in response',
      };

      return { ...nextState, qaResults: [...qaResults, result] };
    })
    .catch(error => {
      const response = error.response;
      let detail;

      if (response) {
        const status = response.status;
        const statusMessage = response.statusText || '';
        let body = response.data;
        if (body && typeof body !== 'string') {
          try {
            body = JSON.stringify(body);
          } catch (e) {
            body = String(body);
          }
        }
        detail = `HTTP ${status} ${statusMessage}`.trim();
        if (body) detail += ` - ${body}`;
      } else {
        detail = `Network error: ${error.message}`;
      }

      const result = {
        name,
        endpoint,
        passed: false,
        detail,
      };

      return { ...state, qaResults: [...qaResults, result] };
    });
});
