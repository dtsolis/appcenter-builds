const config = require('../config/index');

function _promptBasicAuthDialog(res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
  res.end('Authorization Required');
};

function parseAuthorizedUser(authorization) {
  const parts = authorization.split(' ');

  if (parts.length !== 2) return next(error(400));

  const scheme = parts[0]
    , credentials = new Buffer(parts[1], 'base64').toString()
    , index = credentials.indexOf(':');

  if ('Basic' != scheme || index < 0) return next(error(400));

  return {
    user: credentials.slice(0, index),
    pass: credentials.slice(index + 1)
  }
}


function requiresLogin(req, res, next) {
  const authorization = req.headers.authorization;
  if (req.user) {
    return next();
  }
  if (!authorization) {
    return _promptBasicAuthDialog(res);
  }

  const auth = parseAuthorizedUser(authorization);

  let validUser = null;
  config.users.forEach(function (element) {
    // validate user to be any of the users set for parse dashboard
    if (auth.user === element.user && auth.pass === element.pass) {
      validUser = element;
    }
  }, this);

  if (validUser != null) {
    req.user = validUser;
    return next();
  } else {
    return _promptBasicAuthDialog(res);
  }
}



module.exports.requiresLogin = requiresLogin;
