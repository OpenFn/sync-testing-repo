// HTTP adaptor test - hits httpbin.org, no credentials required

// 1. GET request - verify we can read a response
get('https://httpbin.org/json');
fn(state => {
  const body = state.data;
  if (!body || !body.slideshow) {
    throw new Error('FAIL: GET did not return expected slideshow data');
  }
  console.log('PASS: GET request returned expected data');
  return state;
});

// 2. POST request - send data and verify it echoes back
post('https://httpbin.org/post', {
  body: { name: 'OpenFn', test: true },
});
fn(state => {
  const echoed = state.data.json;
  if (!echoed || echoed.name !== 'OpenFn' || echoed.test !== true) {
    throw new Error('FAIL: POST did not echo the sent payload correctly');
  }
  console.log('PASS: POST request echoed payload correctly');

  // Verify status code
  if (state.response.statusCode !== 200) {
    throw new Error(`FAIL: expected status 200, got ${state.response.statusCode}`);
  }
  console.log('PASS: status code is 200');

  return state;
});
