// Node: dog-image
// QA health-check for the Dog CEO random image API.
// Sends GET https://dog.ceo/api/breeds/image/random
// Verifies the response status is 'success' and message is a URL string.
// Appends a result to state.qaResults without overwriting existing entries.

get('https://dog.ceo/api/breeds/image/random');

fn(state => {
  const endpoint = 'https://dog.ceo/api/breeds/image/random';
  const qaResults = state.qaResults || [];

  const body = state.data || {};
  const url = body.message;
  const isUrl = typeof url === 'string' && /^https?:\/\//.test(url);
  const passed = body.status === 'success' && isUrl;

  qaResults.push({
    name: 'dog-image',
    endpoint,
    passed,
    detail: isUrl ? url : null,
  });

  return { ...state, qaResults };
});
