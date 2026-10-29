// QA health-check node: bored-activity
// - Sends a GET request to the Bored API activity endpoint
// - Verifies the response contains a non-empty 'activity' string
// - Appends a pass/fail result object to the shared state.qaResults array
// - Never throws on request or assertion failure; records passed:false instead

fn(state => {
  const name = 'bored-activity';
  const endpoint = 'https://bored-api.appbrewery.com/random';
  const qaResults = state.qaResults || [];

  return get(endpoint)(state)
    .then(nextState => {
      // Success: keep the existing check logic
      const activity = nextState.data && nextState.data.activity;
      const passed =
        typeof activity === 'string' && activity.trim().length > 0;

      return {
        ...nextState,
        qaResults: [
          ...qaResults,
          { name, endpoint, passed, detail: activity },
        ],
      };
    })
    .catch(error => {
      // Failure: build a full explanation, never throw
      let detail;
      const response = error.response || (error.body && error);

      if (response && (response.statusCode || response.status)) {
        const statusCode = response.statusCode || response.status;
        const statusMessage = response.statusMessage || '';
        const body = response.body ?? response.data;
        const bodyText =
          body === undefined || body === null
            ? ''
            : typeof body === 'string'
            ? body
            : JSON.stringify(body);
        detail = `HTTP ${statusCode} ${statusMessage}`.trim();
        if (bodyText) detail += ` - ${bodyText}`;
      } else {
        // Network / non-HTTP failure
        detail = error.message || String(error);
      }

      return {
        ...state,
        qaResults: [
          ...qaResults,
          { name, endpoint, passed: false, detail },
        ],
      };
    });
});