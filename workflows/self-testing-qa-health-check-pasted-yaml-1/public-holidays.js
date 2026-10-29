// QA health-check node: public-holidays
// Sends a GET request to the Nager.Date public holidays API for US 2024.
// Verifies the response is a non-empty array where each holiday has a date and name.
// Appends a pass/fail result to the shared state.qaResults array without overwriting existing entries.
// Any HTTP or network failure is caught and recorded - it never aborts the run.

fn(state => {
  const endpoint = 'https://date.nager.at/api/v3/PublicHolidays/2024/US';

  return get(endpoint)(state)
    .then(s => {
      const holidays = s.data;

      const passed =
        Array.isArray(holidays) &&
        holidays.length > 0 &&
        holidays.every(h => h && h.date && h.name);

      const result = {
        name: 'public-holidays',
        endpoint,
        passed,
        detail: Array.isArray(holidays) ? holidays.length : 0,
      };

      const qaResults = s.qaResults || [];

      return { ...s, qaResults: [...qaResults, result] };
    })
    .catch(error => {
      const resp = error.response;
      let detail;

      if (resp) {
        const status = resp.status ?? resp.statusCode ?? '';
        const message = resp.statusText ?? resp.statusMessage ?? '';
        const body = resp.data ?? resp.body;
        const bodyStr =
          body == null
            ? ''
            : typeof body === 'string'
            ? body
            : JSON.stringify(body);
        detail = `HTTP ${status} ${message}`.trim();
        if (bodyStr) detail += ` - ${bodyStr}`;
      } else {
        detail = error.message || String(error);
      }

      const result = {
        name: 'public-holidays',
        endpoint,
        passed: false,
        detail,
      };

      const qaResults = state.qaResults || [];

      return { ...state, qaResults: [...qaResults, result] };
    });
});
