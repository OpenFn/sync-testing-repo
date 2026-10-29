fn(state => {
  const { title, explanation, url, date } = state.apod;

  // Trim the explanation to a short snippet
  const snippet =
    explanation.length > 200
      ? explanation.slice(0, 200).trim() + '...'
      : explanation;

  const message = `*${title}* (${date})\n\n${snippet}\n\n${url}`;

  return { ...state, message };
});