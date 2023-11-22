'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Submissions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        readOnly: true
      },
      assignment_id: {
        allowNull: false,
        type: Sequelize.UUID,
        readOnly: true
      },
      submission_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      submission_date: {
        type: Sequelize.DATE
      },
      submission_updated: {
        type: Sequelize.DATE,
        readOnly: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('submissions');
  }
};