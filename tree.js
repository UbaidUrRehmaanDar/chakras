const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream('chakras-project-structure.txt');

const SKIP_DIRS = ['node_modules', '.git', 'covers'];
const INDENT = '    ';

function writeTree(dir, indentLevel = 0) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      if (SKIP_DIRS.includes(file)) return;
      output.write(`${INDENT.repeat(indentLevel)}📁 ${file}\n`);
      writeTree(fullPath, indentLevel + 1);
    } else {
      output.write(`${INDENT.repeat(indentLevel)}📄 ${file}\n`);
    }
  });
}

writeTree('./'); // Start from chakras root
output.end(() => console.log('✅ chakras-project-structure.txt created (covers skipped).'));
