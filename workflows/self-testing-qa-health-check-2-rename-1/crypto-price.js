// crypto-price QA health-check node
// Fetches the current Bitcoin price in USD from CoinGecko
// Verifies bitcoin.usd is a positive number
// Appends a result object to the shared state.qaResults array (never overwrites existing entries)
// Never throws: HTTP/network failures are caught and recorded as passed:false

fn(state => {
  const endpoint =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

  const append = (base, result) => ({
    ...base,
    qaResults: [...(base.qaResults || []), result],
  });

  return get(endpoint, {
    headers: { 'User-Agent': 'OpenFn-QA-HealthCheck/1.0' },
  })(state)
    .then(s => {
      // Existing check logic, unchanged
      const price = s.data?.bitcoin?.usd;
      const passed = typeof price === 'number' && price > 0;

      return append(s, {
        name: 'crypto-price',
        endpoint,
        passed,
        detail: price,
      });
    })
    .catch(error => {
      const response = error.response;
      let detail;

      if (response) {
        const status = response.status ?? response.statusCode ?? '';
        const statusText = response.statusText || response.statusMessage || '';
        const body =
          typeof response.data === 'object'
            ? JSON.stringify(response.data)
            : String(response.data ?? '');
        detail = `HTTP ${status} ${statusText} - ${body}`.trim();
      } else {
        detail = `Network error: ${error.message}`;
      }

      return append(state, {
        name: 'crypto-price',
        endpoint,
        passed: false,
        detail,
      });
    });
});
