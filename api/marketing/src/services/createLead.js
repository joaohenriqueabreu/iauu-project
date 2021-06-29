const config          = require('iauu/env');
const moment          = require('moment');
const MauticConnector = require('node-mautic');
const BaseService     = require('iauu/services/base');


module.exports = class CreateLeadService extends BaseService {
  constructor() { 
    super(); 

    this.mauticConnector  = {};
    this.lead             = {};
  }

  async create(user) {
    this.user = user;

    this.initConnection()
      .createLead();

    await this.sendLeadToMautic();
    return this;    
  }

  initConnection() {
    this.mauticConnector = new MauticConnector({
      apiUrl:           config.marketing.baseUrl,
      username:         config.marketing.username,
      password:         config.marketing.password,
      timeoutInSeconds: 5
    });

    return this;
  }

  createLead() {    
    this.lead = {
      ...this.cleanupUser(),
      owner: 4, // ID of Mautic API user
      ipAddress: '192.168.1.1',// some fake ip for now
      lastActive: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    return this;
  }  

  cleanupUser() {
    // Remove sensitive or unecessary user info
    return this.user;
  }

  async sendLeadToMautic() {
    try {
      const response = await this.mauticConnector.contacts.createContact(this.lead);
      console.log(`Lead ${this.user.email} sent to mautic`);
    } catch (error) {
      console.log(error);
    }    

    return this;
  }

}