// QA health-check: cat-fact
// GET https://catfact.ninja/fact
// Verifies the response contains a non-empty 'fact' string.
// Appends a result object to state.qaResults (never overwrites existing entries).
// Records passed:false on failure instead of throwing.

get('https://catfact.ninja/fact');

fn(state => {
  const endpoint = 'https://catfact.ninja/fact';
  const fact = state.data && state.data.fact;
  const passed = typeof fact === 'string' && fact.trim().length > 0;

  const result = {
    name: 'cat-fact',
    endpoint,
    passed,
    detail: passed ? fact.slice(0, 200) : 'No valid fact returned',
  };

  const qaResults = state.qaResults || [];

  return { ...state, qaResults: [...qaResults, result] };
});
