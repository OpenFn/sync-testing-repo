// Self-contained test: CSV parsing, conditional logic, merge, validation
// No credentials or input required.

// 1. Parse a CSV string into structured data
parseCsv(
  `id,name,score
1,Alice,90
2,Bob,75
3,Carol,55`,
  { columns: true, skip_empty_lines: true },
  (state, rows) => {
    state.rows = rows;
    console.log(`Parsed ${rows.length} CSV rows`);
    return state;
  }
);

// 2. Conditionally flag passing scores (>= 60)
fnIf(
  state => state.rows.length > 0,
  fn(state => {
    state.rows = state.rows.map(r => ({
      ...r,
      score: Number(r.score),
      passed: Number(r.score) >= 60,
    }));
    return state;
  })
);

// 3. Merge a static field into every row
merge(
  state => state.rows,
  fields(field('processedAt', () => new Date().toISOString()))
);

// 4. Build a summary string and validate the shape of the data
fn(state => {
  const names = arrayToString(
    state.data.map(r => r.name),
    ', '
  );
  console.log(`Students: ${names}`);

  const schema = {
    type: 'object',
    required: ['id', 'name', 'score', 'passed'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      score: { type: 'number' },
      passed: { type: 'boolean' },
    },
  };

  // Validate every row against the schema
  state.data.forEach(row => {
    const result = validate(schema, row);
    assert(
      result === true || (result && result.valid !== false),
      `Row failed schema validation: ${JSON.stringify(row)}`
    );
  });

  return state;
});

// 5. Define overall pass/fail criteria
fn(state => {
  const passedCount = state.data.filter(r => r.passed).length;
  console.log(`${passedCount} of ${state.data.length} students passed`);

  assert(state.data.length === 3, 'Expected 3 rows from CSV');
  assert(passedCount === 2, 'Expected exactly 2 passing students');

  console.log('✅ CSV/validation test passed');
  return state;
});
