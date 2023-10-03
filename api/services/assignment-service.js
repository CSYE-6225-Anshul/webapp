const Assignment = require('../models/assignment');

const getAllAssignments = async () => {
    return await Assignment.findAll();
}

const getAssignment = async (id) => {
    return await Assignment.findByPk(id);
}

const createAssignment = async (body) => {
    return await Assignment.create(body);
}

const updateAssignment = async (id, body) => {
    return await Assignment.update(body, {
        where: {
            id: id
        }
    });
}

const deleteAssignment = async (id) => {
    return await Assignment.destroy({
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
