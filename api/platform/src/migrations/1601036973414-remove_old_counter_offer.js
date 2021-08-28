const { Presentation } = require('../models');
const db = require('../data/db');
/**
 * Make any changes you need to make to the database here
 */
async function up () {
  await db.connect()

  // Unsetting, deleting, undefined did not work for removing counterOffer field
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
