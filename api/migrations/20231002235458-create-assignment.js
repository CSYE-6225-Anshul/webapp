'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Assignments', {
      id: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        readOnly: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 1,
        max: 10
      },
      num_of_attempts: {
        type: Sequelize.INTEGER,
        min: 1,
        max: 5
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false
      },
      assignment_created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      assignment_updated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Assignments');
  }
};