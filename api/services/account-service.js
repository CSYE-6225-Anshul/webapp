const db = require('../models/index');

const getAccount = async (id) => {
    return await db.Account.findOne({
        where: {
            id: id
        }
    });
}

module.exports = {
    getAccount
}
