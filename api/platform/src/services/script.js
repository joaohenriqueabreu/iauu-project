const db 						= require('lib/data/db');
const { Exception } = require('lib/exception');
const BaseService 	= require('./base');

module.exports = class ScriptService extends BaseService {
    constructor() {
      super();
    }

    async run() {
			try {
				await db.connect();
				await this.runScript();
			} catch (error) {
				console.log(error);
			}

			process.exit(0);
    }

    async runScript() {
      throw new Exception('Must implement abstract runScript function');
    }
}