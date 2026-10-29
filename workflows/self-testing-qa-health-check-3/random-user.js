// random-user: QA health-check node
// - Sends a GET request to https://randomuser.me/api/
// - Verifies the response has a results array with one user having a name and email
// - Appends a result object to the shared state.qaResults array (never overwrites existing entries)
// - Records passed:false on failure instead of throwing

get('https://randomuser.me/api/');

fn(state => {
  const endpoint = 'https://randomuser.me/api/';
  let passed = false;
  let detail = '';

  try {
    const results = state.data && state.data.results;
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

  const qaResults = state.qaResults || [];
  qaResults.push({ name: 'random-user', endpoint, passed, detail });

  return { ...state, qaResults };
});
