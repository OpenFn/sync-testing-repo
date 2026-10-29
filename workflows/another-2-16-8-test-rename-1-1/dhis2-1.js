// Check out the Job Writing Guide for help getting started:
// https://docs.openfn.org/documentation/jobs/job-writing-guide

// Common DHIS2 commands:

// GET - fetch data from DHIS2
// get('tracker/trackedEntities', { orgUnit: 'DiszpKrYNg8' });

// CREATE - create a new record
// create('events', { program: 'eBAyeGv0exc', orgUnit: 'DiszpKrYNg8', status: 'COMPLETED' });

// UPDATE - update an existing record by id
// update('events', 'PMa2VCrupOd', { status: 'COMPLETED' });

// UPSERT - update if exists, otherwise create
// upsert('trackedEntities', { query: { orgUnit: 'DiszpKrYNg8' } }, { /* data */ });

// PATCH - partially update a record
// patch('dataElements', 'FTRrcoaog83', { name: 'New name' });

// DELETE - remove a record
// destroy('events', 'PMa2VCrupOd');

// GET METADATA / analytics export
// get('analytics', { dimension: ['dx:fbfJHSPpUQD'] });
