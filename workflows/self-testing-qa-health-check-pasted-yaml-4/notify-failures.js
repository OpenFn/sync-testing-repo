// notify-failures: Compile a QA failure report and email it to megan@openfn.org.
// - Reads state.qaResults (array of {name, endpoint, passed, detail}).
// - Reads state.errors (object keyed by step id: {message, details, operationName, line, ...}).
// - Always emails a full breakdown. Never throws.

fn(state => {
  const results = state.qaResults || [];
  const errors = state.errors || {};

  const passed = results.filter(r => r.passed);
  const failedResults = results.filter(r => !r.passed);
  const errorEntries = Object.entries(errors);

  const totalFailures = failedResults.length + errorEntries.length;

  const summaryLine = `QA Health Check: ${passed.length}/${results.length} checks passed, ${failedResults.length} failed` +
    (errorEntries.length ? `, ${errorEntries.length} step error(s)` : '');

  // Dog image URL captured by the dog-image check
  const dogResult = results.find(r => r.name === 'dog-image');
  const dogUrl = dogResult && dogResult.passed ? dogResult.detail : null;

  const line = '='.repeat(60);
  const sub = '-'.repeat(60);

  const parts = [];
  parts.push(line);
  parts.push('QA HEALTH CHECK REPORT');
  parts.push(new Date().toISOString());
  parts.push(summaryLine);
  if (dogUrl) {
    parts.push('');
    parts.push(`Dog of the day: ${dogUrl}`);
  }
  parts.push(line);
  parts.push('');

  // FAILED section
  parts.push(`FAILED (${totalFailures})`);
  parts.push(sub);
  if (totalFailures === 0) {
    parts.push('No failures. \u{1F389}');
  } else {
    failedResults.forEach(r => {
      parts.push(`\u2718 ${r.name}`);
      parts.push(`  Endpoint: ${r.endpoint || 'n/a'}`);
      parts.push(`  Detail:   ${r.detail || 'n/a'}`);
      parts.push('');
    });

    errorEntries.forEach(([stepId, err]) => {
      const details = err.details || {};
      const bodyText = details.body != null
        ? (typeof details.body === 'string' ? details.body : JSON.stringify(details.body, null, 2))
        : 'n/a';
      parts.push(`\u26A0 STEP ERROR: ${stepId}`);
      parts.push(`  Operation: ${err.operationName || 'n/a'}${err.line ? ' (line ' + err.line + ')' : ''}`);
      parts.push(`  Status:    ${details.statusCode != null ? details.statusCode : 'n/a'}`);
      parts.push(`  Message:   ${err.message || 'n/a'}`);
      parts.push(`  Body:      ${bodyText}`);
      parts.push('');
    });
  }

  parts.push('');

  // PASSED section
  parts.push(`PASSED (${passed.length})`);
  parts.push(sub);
  if (passed.length === 0) {
    parts.push('No successful checks.');
  } else {
    passed.forEach(r => {
      parts.push(`\u2714 ${r.name}`);
      parts.push(`  Endpoint: ${r.endpoint || 'n/a'}`);
      parts.push(`  Detail:   ${r.detail || 'n/a'}`);
      parts.push('');
    });
  }

  parts.push(line);
  parts.push('Automated QA Health Check \u00B7 OpenFn');
  parts.push(line);

  const body = parts.join('\n');

  const subject = totalFailures > 0
    ? `QA Health Check FAILED - ${totalFailures} issue(s) found`
    : `QA Health Check PASSED - all ${results.length} checks OK`;

  console.log(summaryLine);

  return { ...state, report: { subject, body, totalFailures } };
});

sendMessage({
  to: 'megan@openfn.org',
  subject: state => state.report.subject,
  body: state => state.report.body,
});

// Ensure the step never fails, even if sending errored
fn(state => {
  if (state.errors) {
    console.log('Notification step encountered errors while sending; continuing without throwing.');
  }
  return state;
});