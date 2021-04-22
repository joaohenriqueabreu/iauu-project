const config = require('../../env');
const jwt = require('jwt-simple');
const faker = require('faker');
const crypto = require('crypto');

const { User, Artist, Contractor } = require('../../models');

// 30 days (in seconds)
// const tokenExpiration = 10;
const tokenExpiration = 60 * 60 * 24 * 30;

module.exports = class GenerateTokenService {
    static generateSimple(size = 128) {
        return faker.random.alphaNumeric(size);
    }

    static async generateForUser(user) {  
        const payload = await this.getUserPayload(user);
        return jwt.encode(payload, config.auth.secret);
    }

    static async getUserPayload(user) {
        if (! user instanceof User) {
             throw new Error('Invalid user');
        }

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            id:                     user.id,
            role:                   [user.role], // Role must be an array for frontend $auth handle access scope
            main_role:              user.role, // Should be used by backend
            is_artist:              user.is_artist,
            is_contractor:          user.is_contractor,
            is_admin:               user.is_admin,
            email:                  user.email,
            name:                   user.name,
            photo:                  user.photo,
            role_id:                await user.getRoleId(),
            admin_token:            user.admin_token,
            referral_token:         user.referral.token,
            requires_initial_setup: this.needsSetup(user),
            social: {
                has_connected_with_facebook: user.social.facebook_id !== undefined,
                has_connected_with_google: user.social.google_id !== undefined
            },
            iat:    now,            
            exp:    now + tokenExpiration 
        };
        
        return payload;
    }

    static needsSetup(user) {
        if (user.role === 'artist' && user.artist instanceof Artist) {
            return user.artist.products === undefined || user.artist.products.length === 0;
        }

        return false;
    }

    static encryptId(id) {
        // https://www.w3schools.com/nodejs/ref_crypto.asp
        const encryptionMethod = crypto.createCipheriv('aes-256-cbc', config.encrypt.key, config.encrypt.salt);
        let encrypted = encryptionMethod.update(id, 'utf8', 'hex');
        encrypted += encryptionMethod.final('hex');
        return encrypted;
    }

    static decryptId(id) {
        let key = crypto.createHash('sha256').update(String(config.encrypt.secret)).digest('base64').substr(0, 32);
        var encryptionMethod = crypto.createDecipheriv('aes-256-cbc', config.encrypt.key, config.encrypt.salt);
        var decrypted = encryptionMethod.update(id, 'hex', 'utf8');
        decrypted += encryptionMethod.final('utf8');;
        return decrypted;
    }
}