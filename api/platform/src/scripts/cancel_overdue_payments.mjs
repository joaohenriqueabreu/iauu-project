import db from '../data/db.js';
import { CancelOverduePaymentsScriptService } from '../services/billing/index.js';

console.log('Starting cancel overdue payments script');

const cancelOverduePaymentsSvc = new CancelOverduePaymentsScriptService();
await cancelOverduePaymentsSvc.run();