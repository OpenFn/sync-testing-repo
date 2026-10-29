// Node: ip-geolocation
// Sends a GET request to https://ipapi.co/8.8.8.8/json/
// Verifies the response has ip === '8.8.8.8' and a country_name.
// Appends a pass/fail result object to the shared state.qaResults array.

get('https://ipapi.co/8.8.8.8/json/');

fn(state => {
  const endpoint = 'https://ipapi.co/8.8.8.8/json/';
  const data = state.data || {};

  const passed = data.ip === '8.8.8.8' && !!data.country_name;

  const result = {
    name: 'ip-geolocation',
    endpoint,
    passed,
    detail: data.country_name,
  };

  const qaResults = state.qaResults || [];

  return { ...state, qaResults: [...qaResults, result] };
});
