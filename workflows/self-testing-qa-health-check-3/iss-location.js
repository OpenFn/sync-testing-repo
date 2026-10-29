// iss-location: QA health-check node
// Sends a GET request to the Open Notify ISS location API
// Verifies the response message is 'success' and includes an iss_position with latitude/longitude
// Appends a pass/fail result to the shared state.qaResults array (never overwrites existing entries)

get('http://api.open-notify.org/iss-now.json');

fn(state => {
  const endpoint = 'http://api.open-notify.org/iss-now.json';
  const qaResults = state.qaResults || [];

  const body = state.data || {};
  const pos = body.iss_position || {};

  const passed =
    body.message === 'success' &&
    pos.latitude != null &&
    pos.longitude != null;

  const result = {
    name: 'iss-location',
    endpoint,
    passed,
    detail: { latitude: pos.latitude, longitude: pos.longitude },
  };

  return { ...state, qaResults: [...qaResults, result] };
});
