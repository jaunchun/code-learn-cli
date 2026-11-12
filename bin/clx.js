#!/usr/bin/env node
'use strict';

const app = require('../src/app');

app.main(process.argv.slice(2)).catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
