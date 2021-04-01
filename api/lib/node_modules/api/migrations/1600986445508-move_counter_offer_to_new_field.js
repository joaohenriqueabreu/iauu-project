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
    if (typeof presentation.proposal.counterOffer !== 'object') {
      console.log(`No counter offer for presentation ${presentation.id}...`)
      return;
    }

    console.log(`Migrating presentation ${presentation.id} that has a counter offer`);

    presentation.proposal.counter_offer = presentation.proposal.counterOffer;
    await presentation.save();
    console.log('Presentation saved')
  });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
