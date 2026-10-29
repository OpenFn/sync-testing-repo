// QA health-check node: bored-activity
// - Sends a GET request to the Bored API activity endpoint
// - Verifies the response contains a non-empty 'activity' string
// - Appends a pass/fail result object to the shared state.qaResults array
// - Never throws on assertion failure; records passed:false instead

get('https://www.boredapi.com/api/activity');

fn(state => {
  const endpoint = 'https://www.boredapi.com/api/activity';
  const activity = state.data && state.data.activity;
  const passed = typeof activity === 'string' && activity.trim().length > 0;

  const qaResults = state.qaResults || [];

  return {
    ...state,
    qaResults: [
      ...qaResults,
      {
        name: 'bored-activity',
        endpoint,
        passed,
        detail: activity,
      },
    ],
  };
});
