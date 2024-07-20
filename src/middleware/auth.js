const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["api_key"] || req.headers.authorization;
    console.log(token);

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, 'SADASDADASMDAS213012123smsdsiiJiNiIInNN.23l23');
    req.user = decoded; // req.user = { user_id: '',  role : '', email : '' }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;