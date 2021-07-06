const fs    = require('fs');
const path  = require('path');

const getFileContents = async (filename) => {
  const contents = await JSON.parse(fs.readFileSync(path.join(__dirname, `../../config/static/${filename}.json`), 'utf8'));
  return contents;
}

module.exports = { getFileContents }