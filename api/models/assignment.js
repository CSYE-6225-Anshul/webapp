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
    }
  }
  Assignment.init({
    name: DataTypes.STRING,
    points: DataTypes.NUMBER,
    num_of_attempts: DataTypes.NUMBER,
    deadline: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Assignment',
  });
  return Assignment;
};