const db = require('../models/index');
const basicAuth = require('basic-auth');
const bcrypt = require('bcrypt');

const authMiddleware = async (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name || !credentials.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).send('Unauthorized');
  }

  const { name: username, pass: password } = credentials;

  try {
    // Fetch user from the database based on the provided username
    const user = await db.Account.findOne({
      where: { email: username },
    });

    // If the user doesn't exist or the password is incorrect, deny access
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.status(401).send('Unauthorized');
    }

    // If the username and password are correct, allow access
    next();
  } catch (error) {
    // Handle any errors that occur during the authorization process
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = authMiddleware;
