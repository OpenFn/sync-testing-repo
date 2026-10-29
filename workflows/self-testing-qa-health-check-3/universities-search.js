// QA health-check node: universities-search
// Sends a GET request to the Hipolabs universities API for Kenya.
// Verifies the response is a non-empty array where each university has a name and country.
// Appends a pass/fail result object to the shared state.qaResults array.
// Does not throw on failure - records passed:false instead.

get('http://universities.hipolabs.com/search?country=Kenya');

fn(state => {
  const endpoint = 'http://universities.hipolabs.com/search?country=Kenya';
  const qaResults = state.qaResults || [];

  const data = state.data;
  const isArray = Array.isArray(data);
  const nonEmpty = isArray && data.length > 0;
  const allValid =
    nonEmpty && data.every(u => u && u.name && u.country);
  const passed = Boolean(nonEmpty && allValid);

  qaResults.push({
    name: 'universities-search',
    endpoint,
    passed,
    detail: isArray ? data.length : 0,
  });

  return { ...state, qaResults };
});
