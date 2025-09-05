// backend/utils/db.js
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

const file = path.join(__dirname, "../db.json");
const adapter = new FileSync(file);
const db = low(adapter);

// initialize db
db.defaults({ users: [], achievements: [], notifications: [] }).write();

module.exports = db;
