const db = require('../models/index');

const getAllAssignments = async (accountId) => {
    return await db.Assignment.findAll({
            include: [
              {
                model: db.AccountAssignment,
                as: 'accAssignment',
                where: {
                  accountId: accountId,
                },
              },
            ],
    });
}

const getAssignment = async (id, accountId) => {
    return await db.Assignment.findByPk(id, {
        include: [
            {
                model: db.AccountAssignment,
                as: 'accAssignment'
            },
        ],
    });
}

const createAssignment = async (body) => {
    const transaction = await db.sequelize.transaction();

    try {
        const assignment = await db.Assignment.create(body, { transaction });

        // Create a record in AccountAssignment
        await db.AccountAssignment.create({
            accountId: body.user_id, // Assuming user_id is present in the body
            assignmentId: assignment.id,
        }, { transaction });

        await transaction.commit();
        return assignment;
    } catch (error) {
        await transaction.rollback();
    }
}

const updateAssignment = async (id, body) => {
    const transaction = await db.sequelize.transaction();
    try {
        body.assignment_updated = new Date();
        const updatedAssignment = await db.Assignment.update(body, {
            where: {
                id: id
            },
            returning: true,
            plain: true,
            transaction,
        });

        // Update the associated AccountAssignment record if necessary
        if (body.user_id) {
            await db.AccountAssignment.update(
                { accountId: body.user_id },
                {
                    where: {
                        assignmentId: id,
                    },
                    transaction,
                }
            );
        }

        await transaction.commit();
        return updatedAssignment[1];
    } catch (error) {
        await transaction.rollback();
    }
}

const deleteAssignment = async (id) => {
    const transaction = await db.sequelize.transaction();

    try {
        // Delete the associated AccountAssignment record
        await db.AccountAssignment.destroy({
            where: {
                assignmentId: id,
            },
            transaction,
        });

        // Now delete the Assignment
        const deletedAssignment = await db.Assignment.destroy({
            where: {
                id: id
            },
            transaction,
        });

        await transaction.commit();
        return deletedAssignment;
    } catch (error) {
        await transaction.rollback();
    }
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}
