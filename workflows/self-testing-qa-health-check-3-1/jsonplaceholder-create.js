// jsonplaceholder-create
// QA health-check node: POSTs a sample post to the JSONPlaceholder mock API.
// Verifies the response returns a created resource with an id (mock returns 101).
// Appends a pass/fail result to the shared state.qaResults array (never overwrites).

post('https://jsonplaceholder.typicode.com/posts', {
  title: 'qa',
  body: 'openfn health check',
  userId: 1,
});

fn(state => {
  const endpoint = 'https://jsonplaceholder.typicode.com/posts';
  const qaResults = state.qaResults || [];

  const id = state.data && state.data.id;
  const passed = id != null;

  const result = {
    name: 'jsonplaceholder-create',
    endpoint,
    passed,
    detail: passed
      ? `Created resource with id ${id}`
      : 'No id returned in response',
  };

  return { ...state, qaResults: [...qaResults, result] };
});
