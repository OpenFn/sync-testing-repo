fn(async state => {
  const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
  const maxAttempts = 4;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      return { ...state, data };
    }

    // Only retry on transient 5xx errors
    if (response.status >= 500 && attempt < maxAttempts) {
      console.log(
        `APOD request failed with ${response.status} (attempt ${attempt}/${maxAttempts}), retrying in ${delayMs}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, delayMs));
      continue;
    }

    throw new Error(
      `GET ${url} failed with ${response.status} after ${attempt} attempt(s)`
    );
  }
});

fn(state => {
  const { title, explanation, url, date } = state.data;
  return { ...state, apod: { title, explanation, url, date } };
});
