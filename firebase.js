'use strict';

const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://congreseame-34c11.firebaseio.com"
});

var db = admin.database();
module.exports = db;