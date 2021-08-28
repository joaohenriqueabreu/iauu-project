const { forEach } = require('lodash');

const db = require('../data/db');
const { Artist, User } = require('../models');

async function up () {
  // Write migration here
  await db.connect();
  const artists = await Artist.find({});
  forEach(artists, async (artist) => {
    if (artist.email !== undefined || ! Array.isArray(artist.users) || artist.users.length === 0) { 
      console.log(`Cannot change artist ${artist.name}`);
      return;
    }
    
    const userId = artist.users[0];
    const user = await User.findById(userId);
    if (User.notFound(this.user) || !this.user instanceof User) {
      return;
    }

    artist.email = user.email;

    console.log(`Setting artist ${artist.name} main mail as ${artist.email}`);
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
