require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.devUsername,
    "password": process.env.devPassword,
    "database": process.env.devDB,
    "host": process.env.devHost,
    "dialect": "mysql"
  },
  "test": {
    "username": process.env.testUsername,
    "password": process.env.testPassword,
    "database": process.env.testDB,
    "host": process.env.testHost,
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.prodUsername,
    "password": process.env.prodPassword,
    "database": process.env.prodDB,
    "host": process.env.prodHost,
    "dialect": "mysql"
  }
}
