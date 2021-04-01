module.exports = class VendorGatewayCallbackInterface {
  constructor() { }

  update() { throw new Error('Must implement update interface'); }
}