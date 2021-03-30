const { Presentation } = require('../models');
const _ = require('lodash');
const db = require('../data/db');
/**
 * Make any changes you need to make to the database here
 */
async function up () {
  await db.connect()

  // Write migration here
  const presentations = await Presentation.find();
  _.forEach(presentations, async (presentation) => {
    presentation.proposal.price = presentation.current_price;
    if (presentation.proposal.price === undefined) {
      presentation.proposal.price = 0;
    }

    console.log(`New proposal price ${presentation.proposal.price}`);
    await presentation.save();
    console.log('Proposal saved');
  });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
