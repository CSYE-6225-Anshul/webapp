const db = require('../models/index');
const fs = require('fs');
const csv = require('fast-csv');
const path = require('path');
const baseDir = path.resolve(__dirname, '../opt/users.csv');
const bcrypt = require('bcrypt');

const readCSV = () => {
    return new Promise(async (resolve, reject) => {
        fs.createReadStream(baseDir)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => reject(error))
            .on('data', async row => {
                const hashedPassword = await bcrypt.hash(row.password, 10); // Hash the password
                const [user, created] = await db.Account.findOrCreate({
                    where: {
                        first_name: row.first_name,
                        last_name: row.last_name,
                        email: row.email
                    },
                    defaults: {
                        password: hashedPassword
                    },
                  });
                //   console.log('user', user, created);
            })
            .on('end', () => {
                resolve();
            });
    });
}

module.exports = readCSV;