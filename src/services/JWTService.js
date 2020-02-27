const jwt = require('jsonwebtoken');
const fs = require('fs');

export function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];

  if (token) {
    let cert = fs.readFileSync('./src/keys/public.pem');

    jwt.verify(token, cert, err => {
      if (err) {
        res.status(403).send('Forbidden');
      } else {
        next();
      }
    });
  } else {
    res.status(401).send('Unauthorized');
  }
}

export function createToken(body) {
  let privateKey = fs.readFileSync('./src/keys/private.key');

  return jwt.sign(body, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
}
