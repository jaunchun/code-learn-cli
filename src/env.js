'use strict';
// Environment variables: CLX_HOME, CLX_COURSES, CLX_CLASSIC, CLX_NO_SHUFFLE
// (the old DOJO_* names from before the rename still work).

const env = (name) => process.env['CLX_' + name] || process.env['DOJO_' + name] || '';

module.exports = { env };
