// TEST JOB 1: Core data operations & assertions (common adaptor, no config needed)

// 1. Generate some data into state
fn(state => {
  const users = [
    { id: 1, name: 'alice', active: true },
    { id: 2, name: 'bob', active: false },
    { id: 3, name: 'carol', active: true },
  ];
  return { ...state, data: { users } };
});

// 2. Transform: map + filter active users, uppercase names
fn(state => {
  const activeNames = state.data.users
    .filter(u => u.active)
    .map(u => u.name.toUpperCase());
  return { ...state, activeNames };
});

// 3. Iterate with each() to test list handling
each(
  '$.data.users[*]',
  fn(state => {
    console.log('Processing user:', state.data.name);
    return state;
  })
);

// 4. PASS/FAIL criteria — run fails if any assertion is false
fn(state => {
  assert(
    state.data.users.length === 3,
    'FAIL: expected 3 users'
  );
  assert(
    state.activeNames.length === 2,
    'FAIL: expected 2 active users'
  );
  assert(
    state.activeNames.includes('ALICE'),
    'FAIL: ALICE missing from active names'
  );
  console.log('PASS: all assertions passed for job 1');
  return state;
});
