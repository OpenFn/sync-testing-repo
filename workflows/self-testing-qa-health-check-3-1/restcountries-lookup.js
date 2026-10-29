// Node: restcountries-lookup
// Sends a GET request to https://restcountries.com/v3.1/name/kenya
// Verifies the response is an array containing a country whose common
// name is 'Kenya' and capital is 'Nairobi'.
// Appends a pass/fail result object to the shared state.qaResults array.
// Never throws on assertion failure - records passed:false instead.

get('https://restcountries.com/v3.1/name/kenya');

fn(state => {
  const endpoint = 'https://restcountries.com/v3.1/name/kenya';
  const qaResults = state.qaResults || [];

  let passed = false;
  let detail = '';

  try {
    const data = state.data;
    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }

    const kenya = data.find(
      c =>
        c.name &&
        c.name.common === 'Kenya' &&
        Array.isArray(c.capital) &&
        c.capital.includes('Nairobi')
    );

    if (kenya) {
      passed = true;
      detail = 'Found Kenya with capital Nairobi';
    } else {
      detail = 'No country with common name Kenya and capital Nairobi found';
    }
  } catch (e) {
    detail = `Assertion error: ${e.message}`;
  }

  const result = {
    name: 'restcountries-lookup',
    endpoint,
    passed,
    detail,
  };

  return { ...state, qaResults: [...qaResults, result] };
});