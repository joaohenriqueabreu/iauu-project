require('dotenv').config()
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const GenerateTokenService = require('../services/auth/generateToken')

/**
 * Make any changes you need to make to the database here
 */
async function up () {
  const hash = await bcrypt.hashSync(process.env.ADMIN_PASSWORD, 2)  
  const user = new User({
    email: process.env.ADMIN_EMAIL,
    password: hash,
    name: "Administrador Iauu",
    role: "admin",
    status: "active",
    admin_token: GenerateTokenService.generateSimple(),
    verification: {
      verified: true,
      token: GenerateTokenService.generateSimple(),
      issued_at: Date.now()
    }
  })

  user.access_token = await GenerateTokenService.generateForUser(user)
  await user.save()
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
