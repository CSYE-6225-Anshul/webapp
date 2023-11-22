'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Submission.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      readOnly: true
    },
    assignment_id: {
      primaryKey: true,
      type: DataTypes.UUID,
      allowNull: false,
      readOnly: true
    },
    submission_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submission_date: { 
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    submission_updated: {
      type: DataTypes.DATE,
      readOnly: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
    sequelize,
    modelName: 'Submission',
    timestamps: false, // Disable timestamps
  });

  return Submission;
};