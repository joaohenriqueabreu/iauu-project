const { Artist } = require('../models')
const db = require('../data/db')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
  await db.connect()
  Artist.on('index', function(err) {
    if (err) {
        console.error('index error: %s', err);
    } else {
        console.info('indexing complete');
    }
  })

  await Artist.syncIndexes()
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
