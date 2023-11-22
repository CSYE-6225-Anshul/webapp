'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasMany(models.AccountAssignment, { foreignKey: 'accountId', sourceKey: 'id', as: 'accountAss' });
    }
  }
  Account.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID, // Corrected typo here
      defaultValue: DataTypes.UUIDV4, // You might want to add a default value
      readOnly: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      writeOnly: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    account_created: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      readOnly: true
    },
    account_updated: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      readOnly: true
    },
  }, {
    sequelize,
    modelName: 'Account',
    timestamps: false, // Disable timestamps
  });
  
  return Account;
};
