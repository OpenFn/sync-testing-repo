// crypto-price QA health-check node
// Fetches the current Bitcoin price in USD from CoinGecko
// Verifies bitcoin.usd is a positive number
// Appends a result object to the shared state.qaResults array (never overwrites existing entries)

get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');

fn(state => {
  const endpoint =
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

  const price = state.data?.bitcoin?.usd;
  const passed = typeof price === 'number' && price > 0;

  const qaResults = state.qaResults || [];

  return {
    ...state,
    qaResults: [
      ...qaResults,
      {
        name: 'crypto-price',
        endpoint,
        passed,
        detail: price,
      },
    ],
  };
});
