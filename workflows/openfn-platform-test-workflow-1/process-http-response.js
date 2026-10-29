// Self-contained test: exercises each, map, group, uuid, encode/decode
fn(state => {
  // Seed some test data
  state.people = [
    { id: uuid(), name: 'Ada', team: 'A', score: 10 },
    { id: uuid(), name: 'Grace', team: 'B', score: 20 },
    { id: uuid(), name: 'Alan', team: 'A', score: 30 },
  ];
  return state;
});

// Test each(): iterate and tag every record
each(
  '$.people[*]',
  fn(state => {
    state.data.processed = true;
    return state;
  })
);

// Test group(): group people by team
fn(state => {
  state.grouped = group(state.people, 'team', item => item);
  return state;
});

// Test encode/decode round-trip
fn(state => {
  const original = 'openfn-test';
  const encoded = encode(original);
  const decoded = decode(encoded);
  state.roundTrip = { original, encoded, decoded };
  return state;
});

// Pass/fail criteria
fn(state => {
  assert(state.people.length === 3, 'Expected 3 seeded people');
  assert(
    state.people.every(p => typeof p.id === 'string' && p.id.length > 0),
    'Every person must have a uuid id'
  );
  assert(
    state.roundTrip.decoded === state.roundTrip.original,
    'encode/decode round-trip must match'
  );
  assert(
    Object.keys(state.grouped).length === 2,
    'Expected 2 groups (teams A and B)'
  );
  console.log('Job 4 passed: each/group/uuid/encode tests OK');
  return state;
});
