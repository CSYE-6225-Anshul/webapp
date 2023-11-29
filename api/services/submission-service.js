const db = require('../models/index');

const getAllSubmissions = async (assignment_id) => {
    return await db.Submission.findAll({
        where: {
            assignment_id: assignmentId
        }
    });
}

const getSubmissionCount = async (assignment_id, account_id) => {
    if(account_id) {
        return await db.Submission.count({
            where: {
                assignment_id: assignment_id,
                account_id: account_id
            }
        });
    } else {
        return await db.Submission.count({
            where: {
                assignment_id: assignment_id
            }
        });
    }
}

const createSubmission = async (body) => {
    const transaction = await db.sequelize.transaction();

    try {
        const submission = await db.Submission.create(body, { transaction });
        await transaction.commit();
        return submission;
    } catch (error) {
        console.log(error)
        await transaction.rollback();
    }
}

module.exports = {
    getAllSubmissions,
    getSubmissionCount,
    createSubmission
}
