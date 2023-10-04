'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assignment.hasOne(models.AccountAssignment, { foreignKey: 'assignmentId', sourceKey: 'id', as: 'accAssignment' });
    }
  }
  Assignment.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID, // Corrected typo here
      defaultValue: DataTypes.UUIDV4, // You might want to add a default value
      readOnly: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    assignment_created: { 
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    assignment_updated: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
  }, {
    sequelize,
    modelName: 'Assignment',
    timestamps: false, // Disable timestamps
  });

  return Assignment;
};