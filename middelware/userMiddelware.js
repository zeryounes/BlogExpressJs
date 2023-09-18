const jwt = require('jsonwebtoken')

const secretKey="morocco"


exports.verifyJwt = (req, res, next) => {
    const token=req.cookies.jwt
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          req.user=null
        } else {
          req.user = decoded;
        }
        next()
      });
  }
