const config = require('../api/lib/env');
const RegisterSuperAdminUserScriptService = require('../api/platform/src/services/auth/registerSuperAdminUser');

const initAdmin = async () => {
  const registerAdminUserSvc = new RegisterSuperAdminUserScriptService(
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