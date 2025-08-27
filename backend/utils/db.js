// utils/db.js
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// Create adapter for db.json
const adapter = new FileSync("db.json");
const db = low(adapter);

// Set defaults if file is empty
db.defaults({ users: [] }).write();

module.exports = db;

