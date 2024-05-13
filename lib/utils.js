const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
// const pathToPubKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
// const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');
// const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');

const PRIV_KEY = process.env.PRIV_KEY;
const PUB_KEY = process.env.PUB_KEY;

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}

function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '120s';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function authMiddleware(req, res, next) {
  const tokenParts = req.headers.authorization.split(' ');

  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {

    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, { algorithms: ['RS256'] });
      req.jwt = verification;
      next();
    } catch(err) {
      res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
    }

  } else {
    res.status(401).json({ success: false, msg: "You are not authorized to visit this route" });
  }

}

module.exports = {validPassword, genPassword, issueJWT, authMiddleware};