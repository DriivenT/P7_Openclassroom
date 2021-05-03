const jwt = require('jsonwebtoken');

module.exports = (headerAuth) => {
    let token = headerAuth.split(' ');
    tokenDecoded = jwt.verify(token[1], process.env.TOKEN_SECRET);
    return tokenDecoded.userId;
};