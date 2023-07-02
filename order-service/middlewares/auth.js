const jwt = require('express-jwt');
const secret = process.env.JWT_SECRET;

function authorize(req, res, next) {
  jwt({ secret, algorithms: ['HS256'] })(req, res, next);
}

module.exports = authorize;
