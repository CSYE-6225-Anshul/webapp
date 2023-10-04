const db = require('../models/index');

const getAllAccountAssignments = async () => {
    return await db.AccountAssignment.findAll();
}

const getAccountAssignment = async (id) => {
    return await db.AccountAssignment.findByPk(id);
}

const createAccountAssignment = async (body) => {
    return await db.AccountAssignment.create(body);
}

const updateAccountAssignment = async (id, body) => {
    return await db.AccountAssignment.update(body, {
        where: {
            id: id
        }
    });
}

const deleteAccountAssignment = async (id) => {
    return await db.AccountAssignment.destroy({
        where: {
            id: id
        }
    });
}

module.exports = {
    getAllAccountAssignments,
    getAccountAssignment,
    createAccountAssignment,
    updateAccountAssignment,
    deleteAccountAssignment
}
