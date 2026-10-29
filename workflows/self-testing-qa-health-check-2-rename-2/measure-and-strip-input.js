// Hello World!
// Measure the incoming custom input, then strip it so the big payload
// doesn't get dragged through the rest of the chain (avoids OOM "killed").
fn(state => {
  const original = state.data || {};

  // Measure the raw payload size
  const json = JSON.stringify(original);
  const bytes = json.length;
  const mb = (bytes / 1024 / 1024).toFixed(2);

  // Try to count rows if the test payload used { data: { rows: [...] } }
  const rowCount = Array.isArray(original.rows) ? original.rows.length : null;

  console.log(
    `Custom input payload: ${mb} MB` +
      (rowCount !== null ? `, ${rowCount} rows` : '')
  );

  // Replace the big payload with a lightweight summary so downstream
  // steps carry a tiny state through the whole chain.
  return {
    ...state,
    data: {
      inputSizeCheck: {
        bytes,
        mb: Number(mb),
        rowCount,
      },
    },
  };
});
