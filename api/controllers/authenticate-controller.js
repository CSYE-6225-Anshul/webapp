const db = require("../models/index");
// const basicAuth = require("basic-auth");
const bcrypt = require("bcrypt");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.status(401).send("Unauthorized");
  }
  
  // Extract and decode the Base64 credentials
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');

  try {
    // Fetch user from the database based on the provided username
    const user = await db.Account.findOne({
      where: { email: email },
    });

    // If the user doesn't exist or the password is incorrect, deny access
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.set("WWW-Authenticate", "Basic realm=Authorization Required");
      return res.status(401).send("Unauthorized");
    }

    req.user = user.id;

    // If the username and password are correct, allow access
    next();
  } catch (error) {
    // Handle any errors that occur during the authorization process
    console.error(error);
    // res.status(500).send('Internal Server Error');
  }
};

module.exports = authMiddleware;
