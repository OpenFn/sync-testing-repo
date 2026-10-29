prompt('Write a short, fun poem about cats.', { model: 'gemini-3.5-flash-lite' });

fn(state => {
  const d = state.data;
  const poemText =
    state.response ??
    d?.response ??
    d?.text ??
    d?.response?.text ??
    d?.candidates?.[0]?.content?.parts?.[0]?.text ??
    d?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!poemText) {
    console.log('Gemini response shape:', JSON.stringify(d, null, 2));
    throw new Error('Could not find generated poem text in the Gemini response');
  }

  return { ...state, catPoem: { poemText } };
});
