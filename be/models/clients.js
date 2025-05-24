'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // Define associations here
    }
  }

  Client.init({
    // clientId: DataTypes.STRING,
    clientName: DataTypes.STRING,
    // accountManager: DataTypes.STRING,
    // primaryContact: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    title: DataTypes.STRING,
    // mobile: DataTypes.STRING,
    // fax: DataTypes.STRING,
    // creationDate: DataTypes.DATE,
    // billingContact: DataTypes.STRING,
    // billingName: DataTypes.STRING,
    // address1: DataTypes.STRING,
    // address2: DataTypes.STRING,
    // address3: DataTypes.STRING,
    // country: DataTypes.STRING,
    // city: DataTypes.STRING,
    // state: DataTypes.STRING,
    // zip: DataTypes.STRING,
    // status: DataTypes.STRING,
    // clientType: DataTypes.STRING,
    // vatNumber: DataTypes.STRING,
    // abaCodes: DataTypes.STRING,
    // currencyCode: DataTypes.STRING,
    // currencySymbol: DataTypes.STRING,
    // accountingIsolation: DataTypes.STRING,
    // minimumTrustBalance: DataTypes.DOUBLE,
  }, {
    sequelize,
    modelName: 'Client',
  });

  return Client;
};
