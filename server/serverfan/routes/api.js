var express = require("express");
const app = require("../app");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://llamaserver:MnKpugjO2CH7z2hA@llamasoltorg.psve8.mongodb.net/LLAMASoltorg?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let testArray = [
  { id: 1, user: "jesper" },
  { id: 2, user: "person" },
];

/*
    Check if username is taken or available
    when creating a user.
    TODO:
            connect to database or file
            cleanup log
            better redirect when user taken
*/
function isAvailable(req, res, next) {
  let usernames;
  client.connect((err) => {
    const collection = client.db("test").collection("users");
    usernames = test(collection);
  });

  const usernameExists = !!usernames.find((user) => {
    return user.username === req.body.username;
  });

  console.log(usernameExists + "#####" + req.body.username);

  if (!usernameExists) {
    console.log("@@@@ NOT in array");
    return next();
  }
  res.redirect("/");
  console.log("!!! User in array");
}

async function fromDB(collection) {
  const allItems = await collection.find().toArray();
  client.close();
  return allItems;
}
async function toDB(collection, body) {
    let result;
    let all = await collection.insertOne(body, (error, result) => {
        if (error) {
            throw error;
        }
        result = result;
    });
    client.close();
    return result;
}

/* GET home page. */
router.get("/", function (req, res, next) {
  client.connect((err) => {
    const collection = client.db("test").collection("users");
    let items = fromDB(collection);
    res.send(items.users);
  });
});

/*
    /api/createAccount
    Needs a username and password from client
    and checks if valid and not in use.
    Responds with outcome. 
*/
router.post("/createAccount", function (req, res) {
    client.connect((err) => {
        const collection = client.db("test").collection("users");
        let result = toDB(collection, req.body);
        res.send(result);
    });
  // TODO: create account
});

module.exports = router;
