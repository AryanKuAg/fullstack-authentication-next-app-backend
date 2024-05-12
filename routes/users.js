const router = require("express").Router();
const {authMiddleware, genPassword,issueJWT, validPassword} = require("../lib/utils");
const {getClient} = require("../config/database");
const { ObjectId } = require("mongodb");

router.get("/users",authMiddleware, async (req, res, next) => {
  const client = getClient();
  const collection = client.db("users_db").collection("users");
  const pipeline = [
    {
      $project: {
        _id: 1, 
        username: 1, 
        firstName: 1,
      },
    },
  ];
  try {
    const users = await collection.aggregate(pipeline).toArray();
    console.log(users)
    return res.json({users});
  } catch (err) {
    return res
        .status(401)
  }
});

router.get("/protected", authMiddleware, (req, res, next) => {
  res
    .status(200)
    .json({
      success: true,
      msg: "You are successfully authenticated to this route!",
    });
});

// Validate an existing user and issue a JWT
router.post("/login", async function (req, res, next) {
  const client = getClient();
  const collection = client.db("users_db").collection("users");

  try {
    let user = await collection.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ success: false, msg: "could not find user" });
    }

    // Function defined at bottom of app.js
    const isValid = validPassword(
      req.body.password,
      user.hash,
      user.salt
    );

    if (isValid) {
      const tokenObject = issueJWT(user);

      return res
        .status(200)
        .json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });
    } else {
      return res
        .status(401)
        .json({ success: false, msg: "you entered the wrong password" });
    }
  } catch (err) {
    next(err);
  }
});

// Register a new user
router.post("/register", async function (req, res, next) {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const client = getClient();
  const collection = client.db("users_db").collection("users");
  try {
    delete req.body.password;
    delete req.body.terms;

    // Adding the user to the Database
   let insertedUser = await collection.insertOne({
            ...req.body,
            hash: hash,
            salt: salt,
    });

    // Finding the user to the Database
    let user = await collection.findOne({_id: new ObjectId(insertedUser.insertedId)});

    // Issueing JWT
    const tokenObject = issueJWT(user);

    return res.json({ success: true, user: insertedUser, token: tokenObject.token, expiresIn: tokenObject.expires });

  } catch (err) {
    console.log(err)
    res.json({ success: false, msg: err });
  }
});

module.exports = router;
