// random-user: QA health-check node
// - Sends a GET request to https://randomuser.me/api/
// - Verifies the response has a results array with one user having a name and email
// - Appends a result object to the shared state.qaResults array (never overwrites existing entries)
// - Records passed:false on failure instead of throwing
// - A non-2xx response or network error is caught here and never aborts the workflow

fn(state => {
  const endpoint = 'https://randomuser.me/api/';
  const name = 'random-user';

  // Run the request inside the fn so any failure can be caught here.
  return get(endpoint)(state)
    .then(s => {
      let passed = false;
      let detail = '';

      try {
        const results = s.data && s.data.results;
        if (!Array.isArray(results)) {
          detail = 'Response has no results array';
        } else if (results.length !== 1) {
          detail = `Expected 1 user, got ${results.length}`;
        } else {
          const user = results[0];
          const hasName = !!(user.name && (user.name.first || user.name.last));
          const hasEmail = !!user.email;
          if (hasName && hasEmail) {
            passed = true;
            detail = `Found user ${user.name.first} ${user.name.last} <${user.email}>`;
          } else {
            detail = `Missing ${!hasName ? 'name' : ''}${!hasName && !hasEmail ? ' and ' : ''}${!hasEmail ? 'email' : ''}`;
          }
        }
      } catch (e) {
        detail = `Assertion error: ${e.message}`;
      }

      const qaResults = s.qaResults || [];
      qaResults.push({ name, endpoint, passed, detail });
      return { ...s, qaResults };
    })
    .catch(err => {
      // Non-2xx response or network error: never throw, record the failure.
      const response = err && err.response;
      let detail;

      if (response) {
        const status = response.status ?? response.statusCode ?? '?';
        const statusText = response.statusText ?? response.statusMessage ?? '';
        const body = response.data ?? response.body;
        const bodyStr =
          body === undefined
            ? ''
            : ` - body: ${typeof body === 'string' ? body : JSON.stringify(body)}`;
        detail = `HTTP ${status} ${statusText}${bodyStr}`;
      } else {
        detail = `Network error: ${err && err.message ? err.message : String(err)}`;
      }

      const qaResults = state.qaResults || [];
      qaResults.push({ name, endpoint, passed: false, detail });
      return { ...state, qaResults };
    });
});