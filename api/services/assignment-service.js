const db = require('../models/index');

const getAllAssignments = async () => {
    console.log('-her')
    return await db.Assignment.findAll();
}

const getAssignment = async (id) => {
    return await db.Assignment.findByPk(id);
}

const createAssignment = async (body) => {
    return await db.Assignment.create(body);
}

const updateAssignment = async (id, body) => {
    return await db.Assignment.update(body, {
        where: {
            id: id
        }
    });
}

const deleteAssignment = async (id) => {
    return await db.Assignment.destroy({
        where: {
            id: id
        }
    });
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}
