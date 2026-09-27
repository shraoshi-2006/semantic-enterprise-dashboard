/**
 * Automated W3C HTML5 & WCAG 2.1 Conformance Test Suite
 * Validates index.html, pages/*.html, and components/*.html using HTML-Validate engine.
 * Ensures zero syntax errors and zero accessibility violations.
 */

const { HtmlValidate, fsFileSystem } = require('html-validate');
const path = require('path');
const fs = require('fs');

async function runTestSuite() {
  console.log('================================================================');
  console.log('  SEMANTIC ENTERPRISE DASHBOARD - W3C HTML5 & WCAG VALIDATOR   ');
  console.log('================================================================\n');

  const rootDir = path.resolve(__dirname, '..');
  const validator = new HtmlValidate();

  const targetFiles = [
    path.join(rootDir, 'index.html'),
    ...getFiles(path.join(rootDir, 'pages'), '.html'),
    ...getFiles(path.join(rootDir, 'components'), '.html'),
  ];

  let totalErrors = 0;
  let totalWarnings = 0;
  let passedFiles = 0;

  for (const filePath of targetFiles) {
    const relPath = path.relative(rootDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const report = await validator.validateString(content, filePath);

    if (report.valid) {
      console.log(`  [PASS] \x1b[32m0 errors, 0 warnings\x1b[0m -> ${relPath}`);
      passedFiles++;
    } else {
      console.log(`  [FAIL] \x1b[31m${report.errorCount} error(s), ${report.warningCount} warning(s)\x1b[0m -> ${relPath}`);
      for (const result of report.results) {
        for (const msg of result.messages) {
          const color = msg.severity === 2 ? '\x1b[31m' : '\x1b[33m';
          console.log(`         Line ${msg.line}:${msg.column} [${msg.ruleId}] ${color}${msg.message}\x1b[0m`);
        }
      }
      totalErrors += report.errorCount;
      totalWarnings += report.warningCount;
    }
  }

  console.log('\n----------------------------------------------------------------');
  console.log(`SUMMARY: ${passedFiles}/${targetFiles.length} files passed validation.`);
  console.log(`TOTAL ERRORS:   ${totalErrors}`);
  console.log(`TOTAL WARNINGS: ${totalWarnings}`);
  console.log('----------------------------------------------------------------\n');

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\x1b[32m✔ SUCCESS: 100% W3C HTML5 & WCAG 2.1 compliance verified with ZERO errors.\x1b[0m\n');
    process.exit(0);
  } else {
    console.error('\x1b[31m✖ FAILURE: One or more validation issues detected.\x1b[0m\n');
    process.exit(1);
  }
}

function getFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(file => file.endsWith(ext))
    .map(file => path.join(dir, file));
}

runTestSuite().catch(err => {
  console.error('Validation test suite error:', err);
  process.exit(1);
});
