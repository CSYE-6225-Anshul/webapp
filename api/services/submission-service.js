const db = require('../models/index');

const getAllSubmissions = async (assignment_id) => {
    return await db.Submission.findAll({
        where: {
            assignment_id: assignmentId
        }
    });
}

const getSubmissionCount = async (assignment_id) => {
    return await db.Submission.count({
        where: {
            assignment_id: assignment_id
        }
    });
}

const createSubmission = async (body) => {
    const transaction = await db.sequelize.transaction();

    try {
        const submission = await db.Submission.create(body, { transaction });
        await transaction.commit();
        return submission;
    } catch (error) {
        await transaction.rollback();
    }
}

module.exports = {
    getAllSubmissions,
    getSubmissionCount,
    createSubmission
}
