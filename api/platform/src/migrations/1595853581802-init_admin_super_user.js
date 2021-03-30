const config = require('../config');
const db = require('../data/db');

const RegisterAdminUserService = require('../services/auth/registerAdminUser');
/**
 * Make any changes you need to make to the database here
 */
async function up () {
  await db.connect();
  const registerAdminUserSvc = new RegisterAdminUserService('admin', config.admin.mail, config.admin.password);
  await registerAdminUserSvc.register();
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
