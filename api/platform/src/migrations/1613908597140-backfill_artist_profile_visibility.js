const { forEach } = require('lodash');

const db = require('../data/db');
const { Artist } = require('../models');

async function up () {
  // Write migration here
  await db.connect();
  const artists = await Artist.find({});
  forEach(artists, async (artist) => {
    artist.public = true;

    console.log(`Setting artist ${artist.name} as publicly visible`);
    await artist.save();
    console.log('Artist saved');
  });
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
