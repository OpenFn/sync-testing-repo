// QA health-check node: public-holidays
// Sends a GET request to the Nager.Date public holidays API for US 2024.
// Verifies the response is a non-empty array where each holiday has a date and name.
// Appends a pass/fail result to the shared state.qaResults array without overwriting existing entries.

get('https://date.nager.at/api/v3/PublicHolidays/2024/US');

fn(state => {
  const endpoint = 'https://date.nager.at/api/v3/PublicHolidays/2024/US';
  const holidays = state.data;

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

  const qaResults = state.qaResults || [];

  return { ...state, qaResults: [...qaResults, result] };
});
