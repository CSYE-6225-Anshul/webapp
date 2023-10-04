const db = require('../models/index');

const getAllAssignments = async () => {
    return await db.Assignment.findAll({
        include: [
            {
                model: db.AccountAssignment,
                as: 'assignment',
                include: [
                    {
                        model: db.Account,
                        as: 'account',
                        attributes: ['id', 'first_name', 'last_name', 'email'],
                    },
                ],
            },
        ],
    });
}

const getAssignment = async (id) => {
    return await db.Assignment.findByPk(id, {
        include: [
            {
                model: db.AccountAssignment,
                as: 'users',
                include: [
                    {
                        model: db.Account,
                        as: 'account',
                        attributes: ['id', 'first_name', 'last_name', 'email'],
                    },
                ],
            },
        ],
    });
}

const createAssignment = async (body) => {
    const transaction = await db.sequelize.transaction();

    try {
        const assignment = await db.Assignment.create(body, { transaction });

        // Create a record in AccountAssignment
        console.log('------accountId', body)
        await db.AccountAssignment.create({
            accountId: body.user_id, // Assuming user_id is present in the body
            assignmentId: assignment.id,
        }, { transaction });

        await transaction.commit();
        return assignment;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

const updateAssignment = async (id, body) => {
    const transaction = await db.sequelize.transaction();
    console.log('-herer, ', id, body)
    try {
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
        throw error;
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
        throw error;
    }
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}
