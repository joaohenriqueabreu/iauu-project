const config = require('../api/lib/env');
const RegisterAdminUserScriptService = require('../api/platform/src/services/auth/registerAdminUser');

const initAdmin = async () => {
  const registerAdminUserSvc = new RegisterAdminUserScriptService(
    'admin', config.admin.mail, config.admin.password
  );

  try {
    console.log('Registering');
    await registerAdminUserSvc.run();
    console.log('Admin registered');
  } catch (error) {
    console.log(error);
  } 
  
  process.exit(0);
}

initAdmin();